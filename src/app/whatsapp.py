import requests
import json
from datetime import datetime

class WhatsAppClient():

    def get_messages(self):
        # url = "http://localhost:8080/getAllNewMessages"
        url = "http://localhost:8080/getAllUnreadMessages"
        payload = json.dumps({})
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        
        if response.status_code == 200:
            with open(f"newmessages{datetime.now()}.json", "w") as file:
                json.dump(response.json(), file, indent=4)
            # self.mark_all_read()
            return response.json().get("response", [])
        else:
            print(f"Error: {response.status_code}")
            # self.mark_all_read()
            return []

    def send_text(self, to, content):
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
        urlAck = "http://localhost:8080/markAllRead"
        payload = json.dumps({})
        headers = {
            'Content-Type': 'application/json'
        }

        responseAck = requests.post(urlAck, headers=headers, data=payload)
        
        if responseAck.status_code == 200:
            print("All messages marked as read.")
        else:
            print(f"Error marking messages as read: {responseAck.status_code}")


# wc = WhatsAppClient()
# response = wc.get_messages()
# response = wc.send_text(to = "919810833020@c.us", content ="!!!!!!!!!!")
