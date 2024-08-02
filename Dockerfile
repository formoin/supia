# 베이스 이미지로 Python 3.9 사용
FROM python:3.9.19

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 요구사항 파일을 컨테이너로 복사
COPY requirements.txt .

# 요구사항 설치
RUN pip install -r requirements.txt

# 모든 애플리케이션 파일을 컨테이너로 복사
COPY . .

# Uvicorn을 통해 애플리케이션 실행
CMD ["uvicorn", "main:app", "--port", "8000"]