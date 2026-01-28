import requests
import json
from datetime import datetime

def get_messages():
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
        return response.json().get("response", [])
    else:
        print(f"Error: {response.status_code}")
        return []

def send_text(to, content):
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

# response = get_messages()
# response = send_text(to = "919810833020@c.us", content = "Hello from CRTL-ALT-ELITE WhatsApp Bot!")
