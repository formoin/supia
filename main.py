import os
import cv2
import numpy as np
from PIL import Image

import base64
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from json import JSONDecodeError

from ultralytics import SAM, YOLO
from convert2idrawing import color_hand_drawing

app = FastAPI()

# Load models
seg_model = SAM("./model/mobile_sam.pt")
cls_model = YOLO("./model/yolov8n-cls.pt")

temp_image_path = "./img/input/temp_image.png"
seg_image_path = "./img/seg/seg_image.png"
output_image_path = "./img/output/hand_drawing_image.png"


@app.get("/")
async def root():
    return {"message": "Hello World"}


# @app.post("/")
# async def main(request: Request):
#     content_type = request.headers.get("Content-Type")

#     if content_type is None:
#         raise HTTPException(status_code=400, detail="No Content-Type provided")
#     elif content_type == "application/json":
#         try:
#             return await request.json()
#         except JSONDecodeError:
#             raise HTTPException(status_code=400, detail="Invalid JSON data")
#     else:
#         raise HTTPException(status_code=400, detail="Content-Type not supported")


@app.post("/process-image/")
async def process_image(file: UploadFile = File(...)):
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
        cv2.imwrite(seg_image_path, new_image_bgra)

        # Classification
        cls_result = cls_model(new_image)
        probs = cls_result[0].probs.top1
        probs_name = cls_result[0].names[probs]

        # Illustration
        hand_drawing_img = color_hand_drawing(new_image, output_image_path)

        # Save hand-drawing image to bytes
        img_byte_arr = BytesIO()
        hand_drawing_img.save(img_byte_arr, format="PNG")
        img_byte_arr = img_byte_arr.getvalue()

        # Convert to Base64
        img_base64 = base64.b64encode(img_byte_arr).decode("utf-8")

        return JSONResponse(
            content={"hand_drawing_img": img_base64, "probs_name": probs_name},
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
