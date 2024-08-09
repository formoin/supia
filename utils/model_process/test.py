from ultralytics import YOLO
import glob
from random import shuffle

# Load a model
model = YOLO("../../model/best.pt")  # load a custom model

test_list = glob.glob("../../../Downloads/test2017/test2017/*")

test_list = [file_name.replace("\\", "/") for file_name in test_list]

shuffle(test_list)


# Predict with the model
# results = model(test_list)  # predict on an image

# model.predict(test_list, save=True)
model.predict("../../img/input/dog3.jpg", save=True, show=True)
