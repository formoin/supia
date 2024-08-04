import boto3
from PIL import Image
from io import BytesIO
import requests
import os

# AWS S3 설정
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
AWS_S3_URL = f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com"

# S3 클라이언트 생성
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

def download_image_from_s3(bucket_name, key):
    try:
        # S3에서 파일 가져오기
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=key)
        image_data = s3_response['Body'].read()

        # MIME 타입 확인
        content_type = s3_response['ContentType']
        print(f"Content-Type: {content_type}")

        # 이미지 데이터 확인
        with open('downloaded_image.png', 'wb') as f:
            f.write(image_data)

        # 이미지 열기
        image = Image.open(BytesIO(image_data))
        return image
    except Exception as e:
        print(f"Error downloading image from S3: {str(e)}")
        return None

def display_image_from_url(url):
    try:
        # URL에서 이미지 가져오기
        response = requests.get(url)
        response.raise_for_status()  # 요청 오류 확인
        image = Image.open(BytesIO(response.content))
        image.show()
    except Exception as e:
        print(f"Error displaying image from URL: {str(e)}")

# 예제 URL 및 파일 키
s3_file_key = 'item/illustrated/5_240805_1208_animal_cougar.png'
s3_image_url = f"{AWS_S3_URL}/{s3_file_key}"

# S3에서 이미지 다운로드 및 출력
image = download_image_from_s3(AWS_S3_BUCKET_NAME, s3_file_key)
if image:
    image.show()
else:
    print("Failed to download image from S3.")

# URL에서 이미지 다운로드 및 출력
display_image_from_url(s3_image_url)