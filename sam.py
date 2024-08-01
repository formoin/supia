import cv2
import matplotlib.pyplot as plt
import numpy as np
import cv2
from PIL import Image
from ultralytics import SAM, YOLO
from draw import color_crayon_style, simplify_colors

# Load models
seg_model = SAM("mobile_sam.pt")
cls_model = YOLO("yolov8n-cls.pt")


"""
Segmentation:
segments the input image
classifies the segmented image
"""

image_path = "./img/input/dog.jpg"
output_path = "./img/seg/test1jpg"
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

new_image = np.dstack((image_rgb, mask))  # Add mask as alpha channel
new_image[mask == 0, 3] = 0  # Set the alpha channel to 0 for the background

# Create an empty image with an alpha channel (RGBA)
new_image = np.zeros((image_rgb.shape[0], image_rgb.shape[1], 4), dtype=np.uint8)

# Copy the original image where the mask is non-zero
new_image[mask == 255, :3] = image_rgb[mask == 255]
new_image[mask == 255, 3] = 255  # Set alpha channel to 255 where mask is non-zero

# Convert to RGB format for saving
new_image_rgb = cv2.cvtColor(new_image, cv2.COLOR_RGBA2BGRA)

# Save the new image
cv2.imwrite("segtest.jpg", new_image_rgb)


"""
Classification:
classifies the segmented image
"""

cls_result = cls_model(new_image)
# print(cls_result)
for result in cls_result:
    probs = result.probs
    # print(probs)

probs = cls_result[0].probs.top1
probs_name = cls_result[0].names[probs]


"""
Illustration:
converts the segmented image to the hand-drawing imagea
"""

input_image_path = r"./img/seg/segment1.jpg"
output_image_path = r"./img/output/blur_kmeans_image5.jpg"
hand_drawing_img = color_crayon_style(input_image_path, output_image_path)


def remove_grabcut_bg(image):
    image = np.array(image)
    tmp = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    _, alpha = cv2.threshold(tmp, 0, 255, cv2.THRESH_BINARY)
    r, g, b = cv2.split(image)
    rgba = [r, g, b, alpha]
    dst = cv2.merge(rgba, 4)
    return dst


remove_bg_image = remove_grabcut_bg(hand_drawing_img)

# Display the original image, the mask, and the overlay
plt.figure(figsize=(15, 5))

plt.subplot(1, 3, 1)
plt.title("Original Image")
plt.imshow(image_rgb)
plt.axis("off")

plt.subplot(1, 3, 2)
plt.title(f"{probs_name}")
plt.imshow(new_image)
plt.axis("off")

plt.subplot(1, 3, 3)
plt.title("Hand-drawing Image")
plt.imshow(remove_bg_image)
plt.axis("off")


plt.show()
