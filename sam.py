import cv2
import matplotlib.pyplot as plt
import numpy as np
import cv2
from PIL import Image
from ultralytics import SAM, YOLO

# Load models
seg_model = SAM("mobile_sam.pt")
cls_model = YOLO("yolov8n-cls.pt")

image_path = "./img/input/dog.jpg"
output_path = "./img/seg/test.jpg"
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

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

# Define a rectangle around the object to segment
rect = cv2.selectROI(image)

# Apply grabCut algorithm
cv2.grabCut(image, mask, rect, None, None, 5, cv2.GC_INIT_WITH_RECT)

# Create a mask where sure and probable foreground pixels are set to 1, others set to 0
mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")

# Create an image where the background is transparent
img = image * mask2[:, :, np.newaxis]

# Convert the image to grayscale
tmp = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Create an alpha channel based on the mask
_, alpha = cv2.threshold(tmp, 0, 255, cv2.THRESH_BINARY)

# Split the BGR channels
b, g, r = cv2.split(img)

# Merge the BGR channels and the alpha channel to get an RGBA image
rgba = [b, g, r, alpha]
dst = cv2.merge(rgba, 4)

# Save the resulting image
cv2.imwrite("test.png", dst)

# Optionally, display the image using PIL
# image_pil = Image.fromarray(transparent_image)
# image_pil.show()
exit()
# Fill the mask with the predicted segment
cv2.fillPoly(mask, [mask_coords.astype(np.int32)], 255)

# Create an overlay by combining the original image with the mask
overlay = image_rgb.copy()
overlay[mask == 255] = [255, 0, 0]  # Color the mask area red for visualization

# Create a new image where the outside of the mask is white
# new_image = image_rgb.copy()
# new_image[mask == 0] = [255, 255, 255]  # Set the area outside the mask to white

# new_image = np.dstack((image_rgb, mask))  # Add mask as alpha channel
# new_image[mask == 0, 3] = 0  # Set the alpha channel to 0 for the background

# Create an empty image with an alpha channel (RGBA)
new_image = np.zeros((image_rgb.shape[0], image_rgb.shape[1], 4), dtype=np.uint8)

# Copy the original image where the mask is non-zero
new_image[mask == 255, :3] = image_rgb[mask == 255]
new_image[mask == 255, 3] = 255  # Set alpha channel to 255 where mask is non-zero

new_image = cv2.cvtColor(new_image, cv2.COLOR_RGB2BGR)
cv2.imwrite(output_path, new_image)

cls_result = cls_model(new_image)
# print(cls_result)
for result in cls_result:
    probs = result.probs
    # print(probs)

probs = cls_result[0].probs.top1
probs_name = cls_result[0].names[probs]


# # Display the original image, the mask, and the overlay
# plt.figure(figsize=(15, 5))

# plt.subplot(1, 2, 1)
# plt.title('Original Image')
# plt.imshow(image_rgb)
# plt.axis('off')

# plt.subplot(1, 2, 2)
# plt.title(f'{probs_name}')
# plt.imshow(new_image)
# plt.axis('off')

# plt.show()
