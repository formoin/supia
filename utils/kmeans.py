import numpy as np
from sklearn.cluster import KMeans
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.animation as animation

def create_kmeans_animation(image_path, num_colors=16):
    # Load image and convert it to numpy array
    image = Image.open(image_path)
    img_array = np.array(image)

    # Reshape the image array to (num_pixels, 4) for RGBA
    reshaped_img_array = img_array.reshape(-1, 4)

    # Applying KMeans clustering
    kmeans = KMeans(n_clusters=num_colors, random_state=0)
    kmeans.fit(reshaped_img_array)

    # Get the clustered image
    clustered_img_array = (
        kmeans.cluster_centers_[kmeans.labels_]
        .reshape(img_array.shape)
        .astype(np.uint8)
    )

    # Create a scatter plot for animation
    fig, ax = plt.subplots()

    def update(frame):
        ax.clear()
        kmeans = KMeans(n_clusters=frame + 1, random_state=0)
        kmeans.fit(reshaped_img_array)
        centers = kmeans.cluster_centers_
        labels = kmeans.labels_

        ax.scatter(reshaped_img_array[:, 0], reshaped_img_array[:, 1], c=labels, s=1, cmap='rainbow')
        ax.scatter(centers[:, 0], centers[:, 1], c='black', s=200, alpha=0.6)
        ax.set_title(f'KMeans Clustering - {frame + 1} Colors')
        ax.axis('off')

    ani = animation.FuncAnimation(fig, update, frames=num_colors, repeat=False)
    
    # Save the animation as a gif
    ani.save('./kmeans_animation.gif', writer='imagemagick', fps=2)
    plt.close()

    return './kmeans_animation.gif'

# Generate the KMeans animation with the provided image
create_kmeans_animation('./img/input/dog.jpg', num_colors=16)
