import cv2
import matplotlib.pyplot as plt
import numpy as np
import os
import boto3
from io import BytesIO
from PIL import Image
from ultralytics import SAM, YOLO

# Load models
seg_model = SAM("../../model/sam_l.pt")

"""
Segmentation:
segments the input image
classifies the segmented image
"""

image_path = "../../img/input/surfinia1.PNG"
output_path = "../../img/seg/surfinia1.PNG"

# Load the original image
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Predict a segment based on a point prompt
center_x = image.shape[1] // 2
center_y = image.shape[0] // 2
# Segmentation
results = seg_model.predict(
    image_path,
    points=[center_x, center_y],
)
# Extract mask coordinates
mask_coords = results[0].masks[0].xy[0]

# Create mask
mask = np.zeros(image_rgb.shape[:2], dtype=np.uint8)
cv2.fillPoly(mask, [mask_coords.astype(np.int32)], 255)

# Create new image with mask as alpha channel
new_image = np.zeros((image_rgb.shape[0], image_rgb.shape[1], 4), dtype=np.uint8)
new_image[mask == 255, :3] = image_rgb[mask == 255]
new_image[mask == 255, 3] = 255

# Convert to BGRA for saving
new_image_bgra = cv2.cvtColor(new_image, cv2.COLOR_RGBA2BGRA)

# Save the new image
cv2.imwrite(output_path, new_image_bgra)
