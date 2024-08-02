import requests
import base64

url = "http://localhost:8000/process-image/"

image_path = "./img/input/dog.jpg"

with open(image_path, "rb") as image_file:
    files = {"file": image_file}
    response = requests.post(url, files=files)

# check response
if response.status_code == 200:
    response_data = response.json()
    hand_drawing_img_encode = response_data["hand_drawing_img"]
    probs_name = response_data["probs_name"]

    # encode to image
    hand_drawing_img_bytes = base64.b64decode(hand_drawing_img_encode)
    with open("output_hand_drawing_image.png", "wb") as output_image:
        output_image.write(hand_drawing_img_bytes)

    print(f"Classification Result: {probs_name}")
    print("Hand-drawing image saved as output_hand_drawing_image.png")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
