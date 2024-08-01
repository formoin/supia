import numpy as np
import cv2
import matplotlib.pyplot as plt
import pickle


# Function to load CIFAR-100 file
def load_cifar100(file):
    with open(file, "rb") as fo:
        dict = pickle.load(fo, encoding="bytes")
    return dict


# Load dataset
train_data = load_cifar100("./data/cifar-100/train")
test_data = load_cifar100("./data/cifar-100/test")


# Extract data and labels
train_images = train_data[b"data"]
train_labels = train_data[b"fine_labels"]
test_images = test_data[b"data"]
test_labels = test_data[b"fine_labels"]

# Reshape images
train_images = train_images.reshape(-1, 3, 32, 32).transpose(0, 2, 3, 1)
test_images = test_images.reshape(-1, 3, 32, 32).transpose(0, 2, 3, 1)

# Class names
label_names = [
    "apple",
    "aquarium_fish",
    "baby",
    "bear",
    "beaver",
    "bed",
    "bee",
    "beetle",
    "bicycle",
    "bottle",
    "bowl",
    "boy",
    "bridge",
    "bus",
    "butterfly",
    "camel",
    "can",
    "castle",
    "caterpillar",
    "cattle",
    "chair",
    "chimpanzee",
    "clock",
    "cloud",
    "cockroach",
    "couch",
    "crab",
    "crocodile",
    "cup",
    "dinosaur",
    "dolphin",
    "elephant",
    "flatfish",
    "forest",
    "fox",
    "girl",
    "hamster",
    "house",
    "kangaroo",
    "keyboard",
    "lamp",
    "lawn_mower",
    "leopard",
    "lion",
    "lizard",
    "lobster",
    "man",
    "maple_tree",
    "motorcycle",
    "mountain",
    "mouse",
    "mushroom",
    "oak_tree",
    "orange",
    "orchid",
    "otter",
    "palm_tree",
    "pear",
    "pickup_truck",
    "pine_tree",
    "plain",
    "plate",
    "poppy",
    "porcupine",
    "possum",
    "rabbit",
    "raccoon",
    "ray",
    "road",
    "rocket",
    "rose",
    "sea",
    "seal",
    "shark",
    "shrew",
    "skunk",
    "skyscraper",
    "snail",
    "snake",
    "spider",
    "squirrel",
    "streetcar",
    "sunflower",
    "sweet_pepper",
    "table",
    "tank",
    "telephone",
    "television",
    "tiger",
    "tractor",
    "train",
    "trout",
    "tulip",
    "turtle",
    "wardrobe",
    "whale",
    "willow_tree",
    "wolf",
    "woman",
    "worm",
]

print(len(label_names))
exit()


# Function to display images
def plot_images(images, labels, label_names, num_images=100):
    plt.figure(figsize=(20, 20))
    for i in range(num_images):
        plt.subplot(10, 10, i + 1)
        plt.imshow(images[i])
        plt.title(label_names[labels[i]], fontsize=8)
        plt.axis("off")
    plt.show()


# Display 100 images from the dataset
plot_images(train_images, train_labels, label_names, num_images=100)
