from ultralytics import YOLO
import glob
from random import shuffle

# Load a model
model = YOLO("./data/runs/classify/train/weights/best.pt")  # load a custom model

test_list = glob.glob("../../../Downloads/test2017/test2017/*")

test_list = [file_name.replace("\\", "/") for file_name in test_list]

shuffle(test_list)


# Predict with the model
# results = model(test_list)  # predict on an image

# model.predict(test_list, save=True)
model.predict(test_list[:1000], save=True)
