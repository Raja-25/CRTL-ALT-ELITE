import requests
import json
from datetime import datetime
import base64
from os import makedirs, path
from app.tools.translate import Translate

class WhatsAppClient():

    def __init__(self):
        self.__seen_messages = set()
        self.translator = Translate()

    def get_messages(self):
        # url = "http://localhost:8080/getAllNewMessages"
        url = "http://localhost:8080/getAllUnreadMessages"
        payload = json.dumps({})
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        
        if response.status_code == 200:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            # with open(f"newmessages_{timestamp}.json", "w") as file:
            #     json.dump(response.json(), file, indent=4)
            # self.mark_all_read()
            return response.json().get("response", [])
        else:
            print(f"Error: {response.status_code}")
            # self.mark_all_read()
            return []

    def send_text(self, to, content, language='en'):

        if language != 'en':
            content = self.translator.translate_text(content, target_language=language)

        url = "http://localhost:8080/sendText"
        payload = json.dumps({
            "args": {
                "to": to,
                "content": content
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'accept': '*/*'
        }

        response = requests.post(url, headers=headers, data=payload)

        if response.status_code == 200:
            print("Message sent successfully.")
            return response.json()
        else:
            print(f"Error: {response.status_code}, Response: {response.text}")
            return None
        
    def mark_all_read(self):
        try:
            urlAck = "http://localhost:8080/markAllRead"
            payload = json.dumps({})
            headers = {
                'Content-Type': 'application/json'
            }

            responseAck = requests.post(urlAck, headers=headers, data=payload, timeout=5)
            print(responseAck)
            if responseAck.status_code == 200:
                print("All messages marked as read.")
            else:
                print(f"Error marking messages as read: {responseAck.status_code}")
                print(f"Response: {responseAck.text}")
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")

    def save_image(self, message, session, file_path="images/"):

        makedirs(file_path, exist_ok=True)

        url = "http://localhost:8080/decryptMedia"
        payload = json.dumps({
            "args": {
                "message": message
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'accept': '*/*'
        }

        response = requests.post(url, headers=headers, data=payload)

        if response.status_code == 200:
            print("Image download initiated.")
            # with open(f"imageresponse_{session}.json", "w") as file:
            #     json.dump(response.json(), file, indent=4)
            response = response.json()
            response = response.get('response','')
            # Remove the data:image/jpeg;base64, prefix
            image_data = response.split(",")[1]

            # Decode the base64 string
            image_bytes = base64.b64decode(image_data)

            # Save the decoded image to a file
            with open(path.join(file_path, session+'.jpg'), "wb") as image_file:
                image_file.write(image_bytes)
            return path.join(file_path, session+'.jpg')
        else:
            print(f"Error: {response.status_code}, Response: {response.text}")
            return None
        
    def is_seen(self, message):
        message_id = f"{message.get('from', '')}_{message.get('body', '')}"
        print(f"Checking message ID: {message_id}")
        if message_id in self.__seen_messages:
            return True
        else:
            self.__seen_messages.add(message_id)
            return False

# wc = WhatsAppClient()
# response = wc.get_messages()
# response = wc.send_text(to = "919810833020@c.us", content ="!!!!!!!!!!")
