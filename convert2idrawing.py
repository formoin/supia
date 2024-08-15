from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os
from sklearn.cluster import KMeans
from matplotlib import cm
import cv2

# Set the maximum number of CPU cores to use
os.environ["LOKY_MAX_CPU_COUNT"] = "4"


def color_hand_drawing(image_array):

    img = Image.fromarray(image_array)

    # Step 1: Convert image to RGB
    img = img.convert("RGBA")

    # Step 2: Blur image
    img = img.filter(ImageFilter.BoxBlur(radius=1))

    # Step 3: Simplify colors
    img = simplify_colors(img)

    return img


def detect_edges(image):
    # Convert image to gray scale
    gray_image = image.convert("L")

    # Detect Edge
    edges = gray_image.filter(ImageFilter.FIND_EDGES)

    # Convert image to binary
    threshold = 30  # Set 30 or more pixels to white
    binary_edges = edges.point(lambda p: p > threshold and 255)

    # Generate RGB image for edges
    edge_color_image = Image.new("RGB", image.size, (255, 255, 255))
    # Composite black edges on white background
    edge_color_image.paste((0, 0, 0), mask=binary_edges)

    return edge_color_image


def simplify_colors(image):
    # Convert image to numpy array
    img_array = np.array(image)

    # The number of colors to simplify
    num_colors = 16

    # Reduce colors using k-means clustering
    # Reshape the image array to (num_pixels, 4) for RGBA
    reshaped_img_array = img_array.reshape(-1, 4)
    kmeans = KMeans(n_clusters=num_colors, random_state=0).fit(reshaped_img_array)

    # Replace image pixels to the center of nearest cluster
    clustered_img_array = (
        kmeans.cluster_centers_[kmeans.labels_]
        .reshape(img_array.shape)
        .astype(np.uint8)
    )

    # Convert numpy array to image
    return Image.fromarray(clustered_img_array, "RGBA")
