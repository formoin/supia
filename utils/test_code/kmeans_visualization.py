import matplotlib.pyplot as plt
import numpy as np
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from PIL import Image, ImageDraw, ImageFilter


def visualize_color_clustering(image_array, num_colors=16):
    # Step 1: Convert image to numpy array and reshape it for clustering
    img_array = np.array(image_array)
    reshaped_img_array = img_array.reshape(-1, 4)  # Flatten to (num_pixels, 4)

    # Step 2: Perform K-means clustering
    kmeans = KMeans(n_clusters=num_colors, random_state=0).fit(reshaped_img_array)
    labels = kmeans.labels_
    centers = kmeans.cluster_centers_

    # Step 3: Use PCA to reduce dimensions to 2D for visualization
    pca = PCA(n_components=2)
    reduced_data = pca.fit_transform(reshaped_img_array)
    reduced_centers = pca.transform(centers)

    # Step 4: Plot the result
    plt.figure(figsize=(10, 6))

    # Plot the pixels in reduced 2D space, colored by their cluster label
    scatter = plt.scatter(
        reduced_data[:, 0], reduced_data[:, 1], c=labels, cmap="tab20", s=1
    )

    # Plot the cluster centers
    plt.scatter(
        reduced_centers[:, 0],
        reduced_centers[:, 1],
        c="blue",
        s=100,
        marker="*",
        label="Centroids",
    )

    plt.title("Color Clustering Visualization")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.legend()
    plt.show()


# Example usage:
image_array = np.array(Image.open("./img/seg/bird.png"))  # Load your image file here
visualize_color_clustering(image_array)
