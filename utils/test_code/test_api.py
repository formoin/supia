import requests
import base64

url = "https://stirring-dodo-bursting.ngrok-free.app/ai/process-image/"

image_path = "../../img/input/surfinia1.PNG"

with open(image_path, "rb") as image_file:
    files = {"file": image_file}
    data = {"member_id": "1", "time": "240809", "date": "0956"}
    response = requests.post(url, files=files, data=data)

# check response
if response.status_code == 200:
    response_data = response.json()
    hand_drawing_img_encode = response_data["hand_drawing_img_url"]
    category = response_data["category"]
    probs_name = response_data["probs_name"]

    # # encode to image
    # with open("output_hand_drawing_image.png", "wb") as output_image:
    #     output_image.write(hand_drawing_img_encode)

    print(f"Classification Result: {probs_name}")
    print(f"category name: {category}")
    print("Hand-drawing image saved as output_hand_drawing_image.png")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
