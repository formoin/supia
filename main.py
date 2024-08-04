from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from io import BytesIO
import numpy as np
import cv2
import os
import boto3
from ultralytics import SAM, YOLO
from convert2idrawing import color_hand_drawing

app = FastAPI()

# Load models
seg_model = SAM("./model/mobile_sam.pt")
cls_model = YOLO("./model/yolov8n-cls.pt")

# Set AWS S3
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
AWS_S3_URL = f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com"


s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

temp_image_path = "./img/input/temp_image.png"
output_image_path = "./img/output/illustrated.png"


@app.post("/ai/process-image/")
async def process_image(member_id: str = Form(...), date: str = Form(...),
    time: str = Form(...), file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    try:
        # Read image
        image_data = await file.read()
        image = Image.open(BytesIO(image_data))
        image_rgb = np.array(image.convert("RGB"))

        # Convert to BGR for OpenCV
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Save the image temporarily
        cv2.imwrite(temp_image_path, image_bgr)

        # Segment the image
        center_x = image_rgb.shape[1] // 2
        center_y = image_rgb.shape[0] // 2
        results = seg_model.predict(
            temp_image_path, points=[[center_x, center_y]], labels=[1]
        )

        # Extract mask coordinates
        mask_coords = results[0].masks[0].xy[0]

        # Create mask
        mask = np.zeros(image_rgb.shape[:2], dtype=np.uint8)
        cv2.fillPoly(mask, [mask_coords.astype(np.int32)], 255)

        # Create new image with mask as alpha channel
        new_image = np.zeros(
            (image_rgb.shape[0], image_rgb.shape[1], 4), dtype=np.uint8
        )
        new_image[mask == 255, :3] = image_rgb[mask == 255]
        new_image[mask == 255, 3] = 255

        # Convert to BGRA for saving
        new_image_bgra = cv2.cvtColor(new_image, cv2.COLOR_RGBA2BGRA)
        # cv2.imwrite(seg_image_path, new_image_bgra)

        # Classification
        cls_result = cls_model(new_image) 
        probs = cls_result[0].probs.top1
        probs_name = cls_result[0].names[probs]
        category = "animal"

        # Illustration
        hand_drawing_img = color_hand_drawing(new_image)

        # Save hand-drawing image to file
        hand_drawing_img.save(output_image_path)

        # Upload to S3
        s3_file_name = f"item/illustrated/{member_id}_{date}_{time}_{category}_{probs_name}.png"

        s3_client.upload_file(output_image_path, AWS_S3_BUCKET_NAME, s3_file_name)

        file_url = f"{AWS_S3_URL}/{s3_file_name}"

        return JSONResponse(
            content={"hand_drawing_img_url": file_url, "probs_name": probs_name},
            status_code=200,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
