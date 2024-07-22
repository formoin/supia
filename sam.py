import cv2
import matplotlib.pyplot as plt
import numpy as np
import cv2
from PIL import Image
from ultralytics import SAM, YOLO

# Load models
seg_model = SAM("mobile_sam.pt")
cls_model = YOLO("yolov8n-cls.pt")

image_path = "dog.png"
output_path = "segment2.jpg"
# Load the original image
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Predict a segment based on a point prompt
center_x = image.shape[1] // 2
center_y = image.shape[0] // 2
results = seg_model.predict(image_path, points=[[center_x, center_y]], labels=[1])

# Extract mask coordinates
mask_coords = results[0].masks[0].xy[0]  # Extracting the first array from the list

# Create a mask image with the same dimensions as the original image
mask = np.zeros(image.shape[:2], dtype=np.uint8)

# Fill the mask with the predicted segment
cv2.fillPoly(mask, [mask_coords.astype(np.int32)], 255)

# Create an overlay by combining the original image with the mask
overlay = image_rgb.copy()
overlay[mask == 255] = [255, 0, 0]  # Color the mask area red for visualization

# Create a new image where the outside of the mask is white
new_image = image_rgb.copy()
new_image[mask == 0] = [255, 255, 255]  # Set the area outside the mask to white

new_image = cv2.cvtColor(new_image, cv2.COLOR_RGB2BGR)
cv2.imwrite(output_path, new_image)

cls_result = cls_model(new_image)
# print(cls_result)
for result in cls_result:
    probs = result.probs
    # print(probs)

probs = cls_result[0].probs.top1
probs_name = cls_result[0].names[probs]



# Display the original image, the mask, and the overlay
plt.figure(figsize=(15, 5))

plt.subplot(1, 2, 1)
plt.title('Original Image')
plt.imshow(image_rgb)
plt.axis('off')

plt.subplot(1, 2, 2)
plt.title(f'{probs_name}')
plt.imshow(new_image)
plt.axis('off')

plt.show()
