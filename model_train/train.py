from ultralytics import YOLO

# Load a model
model = YOLO("yolov8n-cls.pt")

# Set dataset
dataset_path = "path/to/dataset"

# Train the model
results = model.train(data=dataset_path, epochs=100, imgsz=64)
