from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import numpy as np
import cv2
import os
import boto3
from ultralytics import SAM, YOLO
from convert2idrawing import color_hand_drawing
from dotenv import load_dotenv
import base64

load_dotenv()

app = FastAPI()

# Load models
seg_model = SAM("./model/sam_b.pt")
cls_model = YOLO("./model/cls-x.pt")

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
output_image_path = r"illustrated.png"

species_dict = {
    "동물": {
        "bird": "새",
        "cat": "고양이",
        "dog": "강아지",
        "frog": "개구리",
        "snail": "달팽이",
    },
    "곤충": {
        "butterfly": "나비",
        "dragonfly": "잠자리",
        "grasshopper": "메뚜기",
        "ladybird": "무당벌레",
        "stag_beetle": "사슴벌레",
    },
    "식물": {
        "daisy": "데이지",
        "dandelion": "민들레",
        "rose": "장미",
        "sunflower": "해바라기",
        "tulip": "튤립",
        "basil": "바질",
        "cactus": "선인장",
        "marigold": "메리골드",
        "surfinia": "사피니아",
    },
}


@app.post("/ai/process-image/")
async def process_image(
    member_id: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    file: UploadFile = File(...),
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    if not (
        file.filename.lower().endswith(".png") or file.filename.lower().endswith(".jpg")
    ):
        raise HTTPException(status_code=400, detail="Only .png files are allowed")

    try:
        # Read image
        image_data = await file.read()
        image = Image.open(BytesIO(image_data))
        image_rgb = np.array(image.convert("RGB"))

        frame_width = image.size[0] * 0.8
        frame_height = image.size[1] * 0.4

        center_x = int(image.size[0] // 2)
        center_y = int(image.size[1] // 2)

        # top-left corner of frame
        x1 = int(center_x - frame_width // 2)
        y1 = int(center_y - frame_height // 2)

        # buttom-right corner of frame
        x2 = int(center_x + frame_width // 2)
        y2 = int(center_y + frame_height // 2)

        # Convert to BGR for OpenCV
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Save the image temporarily
        cv2.imwrite(temp_image_path, image_bgr)

        # Classification
        cls_result = cls_model(image_rgb[y1:y2, x1:x2])
        probs = cls_result[0].probs.top1
        probs_name = cls_result[0].names[probs]
        probs_conf = cls_result[0].probs.top1conf.detach().item()

        # Determine category and Korean name
        category = None
        probs_name_kr = None

        if probs_conf < 0.8:
            category = "기타"
            probs_name_kr = "unknown"
        else:
            for cat, species in species_dict.items():
                if probs_name in species:
                    category = cat
                    probs_name_kr = species[probs_name]
                    break

            if category is None or probs_name_kr is None:
                raise HTTPException(status_code=400, detail="Unrecognized species name")

        # Segmentation
        results = seg_model.predict(
            temp_image_path,
            points=[center_x, center_y],
            bboxes=[x1 + 5, y1 + 5, x2 - 5, y2 - 5],
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

        # Illustration
        hand_drawing_img = color_hand_drawing(new_image).crop(
            (x1 - 5, y1 - 5, x2 + 5, y2 + 5)
        )

        # Save hand-drawing image to file
        hand_drawing_img.save(output_image_path)

        # Upload to S3
        s3_original_file_name = (
            f"item/original/{member_id}_{date}_{time}_{category}_{probs_name}.png"
        )

        s3_client.upload_file(
            temp_image_path, AWS_S3_BUCKET_NAME, s3_original_file_name
        )

        s3_file_name = (
            f"item/illustrated/{member_id}_{date}_{time}_{category}_{probs_name_kr}.png"
        )

        s3_client.upload_file(output_image_path, AWS_S3_BUCKET_NAME, s3_file_name)

        file_url = f"{AWS_S3_URL}/{s3_file_name}"

        return JSONResponse(
            content={
                "hand_drawing_img_url": file_url,
                "category": category,
                "probs_name": probs_name_kr,
            },
            status_code=200,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/ai/process-image/webrtc")
async def process_image(
    member_id: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    file: str = Form(...),
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    try:
        # base64 문자열의 길이를 4의 배수로 만들어 패딩 문제 해결
        missing_padding = len(file) % 4
        if missing_padding:
            file += "=" * (4 - missing_padding)

        try:
            # base64 디코딩
            image_data = base64.b64decode(file)
            print("Base64 decoding successful")

            # 디코딩된 데이터의 길이를 출력 (디버깅용)
            print(f"Decoded image data length: {len(image_data)} bytes")

            # 이미지를 로드할 수 있는지 확인
            image = Image.open(BytesIO(image_data))
            print("Image loading successful")

        except (base64.binascii.Error, UnidentifiedImageError) as e:
            print(f"Error during decoding or image loading: {str(e)}")
            raise HTTPException(
                status_code=400, detail="Invalid image file or base64 encoding error"
            )

        if not (image.format.lower() == "png" or image.format.lower() == "jpg"):
            raise HTTPException(
                status_code=400, detail="Only .png or .jpg files are allowed"
            )

        image_rgb = np.array(image.convert("RGB"))

        frame_width = image.size[0] * 0.8
        frame_height = image.size[1] * 0.4

        center_x = int(image.size[0] // 2)
        center_y = int(image.size[1] // 2)

        # top-left corner of frame
        x1 = int(center_x - frame_width // 2)
        y1 = int(center_y - frame_height // 2)

        # buttom-right corner of frame
        x2 = int(center_x + frame_width // 2)
        y2 = int(center_y + frame_height // 2)

        # Convert to BGR for OpenCV
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Save the image temporarily
        temp_image_path = "temp_image.png"
        cv2.imwrite(temp_image_path, image_bgr)

        # Classification
        cls_result = cls_model(image_rgb[y1:y2, x1:x2])
        probs = cls_result[0].probs.top1
        probs_name = cls_result[0].names[probs]
        probs_conf = cls_result[0].probs.top1conf.detach().item()

        # Determine category and Korean name
        category = None
        probs_name_kr = None

        if probs_conf < 0.8:
            category = "기타"
            probs_name_kr = "unknown"
        else:
            for cat, species in species_dict.items():
                if probs_name in species:
                    category = cat
                    probs_name_kr = species[probs_name]
                    break

            if category is None or probs_name_kr is None:
                raise HTTPException(status_code=400, detail="Unrecognized species name")

        # Segmentation
        results = seg_model.predict(
            temp_image_path,
            points=[center_x, center_y],
            bboxes=[x1 + 5, y1 + 5, x2 - 5, y2 - 5],
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

        # Illustration
        hand_drawing_img = color_hand_drawing(new_image).crop(
            (x1 - 5, y1 - 5, x2 + 5, y2 + 5)
        )

        # Save hand-drawing image to file
        output_image_path = "output_image.png"
        hand_drawing_img.save(output_image_path)

        # Upload to S3
        s3_original_file_name = (
            f"item/original/{member_id}_{date}_{time}_{category}_{probs_name}.png"
        )

        s3_client.upload_file(
            temp_image_path, AWS_S3_BUCKET_NAME, s3_original_file_name
        )

        s3_file_name = (
            f"item/illustrated/{member_id}_{date}_{time}_{category}_{probs_name_kr}.png"
        )

        s3_client.upload_file(output_image_path, AWS_S3_BUCKET_NAME, s3_file_name)

        file_url = f"{AWS_S3_URL}/{s3_file_name}"

        return JSONResponse(
            content={
                "hand_drawing_img_url": file_url,
                "category": category,
                "probs_name": probs_name_kr,
            },
            status_code=200,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
