# 베이스 이미지로 Python 3.9 사용
FROM python:3.9.19

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 요구사항 파일을 컨테이너로 복사
COPY requirements.txt .

# 요구사항 설치
RUN pip install -r requirements.txt
RUN pip uninstall opencv-python -y
RUN pip install --no-cache-dir opencv-python
RUN apt-get update && apt-get install libgl1-mesa-glx -y
RUN apt-get install libglib2.0-0

# 모든 애플리케이션 파일을 컨테이너로 복사
COPY . .

# Uvicorn을 통해 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]