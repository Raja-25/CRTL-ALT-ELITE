from os import getenv, path, makedirs
from dotenv import load_dotenv
from openai import AzureOpenAI
from app.models.env import Environment
import re
import json
import base64

class Roles:
    SYSTEM: str = "system"
    USER: str = "user"
    ASSISTANT: str = "assistant"


class LLM():

    def __init__(self, model_name: str, session: str):

        load_dotenv()

        self.__model: str = model_name
        
        self.__session_path: str = path.join("inference", session+".txt")
        makedirs(path.dirname(self.__session_path), exist_ok=True)


        self.CONTENT: str = "content"
        self.ROLE: str = "role"

        self.__client = AzureOpenAI(
            api_key = getenv(Environment.AZURE_API_KEY, ''),
            azure_endpoint = getenv(Environment.AZURE_ENDPOINT, ''),
            api_version = "2024-02-01"
        )

    def chat(self, system_prompt: str, user_prompt: str) -> str:

        context = self.__get_session_context()

        messages = [
            {
                self.ROLE: Roles.SYSTEM,
                self.CONTENT: system_prompt + "\n\nPrevious chat History Context:\n" + context
            },
            {
                self.ROLE: Roles.USER,
                self.CONTENT: user_prompt
            }
        ]

        response = self.__client.chat.completions.create(
            model = self.__model,
            messages = messages
        )

        self.__push_to_session(Roles.USER, user_prompt)
        self.__push_to_session(Roles.ASSISTANT, response.choices[0].message.content)

        return response.choices[0].message.content
    
    def __push_to_session(self, role: str, content: str) -> None:
        with open(self.__session_path, "a", encoding="utf-8") as file:
            file.write(f"Role: {role}\nContent: {content}\n\n\n")

    def __get_session_context(self) -> str:
        if not path.exists(self.__session_path):
            return ""
        
        with open(self.__session_path, "r", encoding="utf-8") as file:
            return file.read()
        
    def json_extractor(self, text: str) -> dict:

        markdown_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        markdown_match = re.search(markdown_pattern, text)

        if markdown_match:
            json_str = markdown_match.group(1).strip()

        else:
            json_pattern = r'\{[\s\S]*\}'
            json_match = re.search(json_pattern, text)
            if json_match:
                json_str = json_match.group(0).strip()
            else:
                raise ValueError("No JSON content found in the text.")
        
        # Unescape double braces {{ }} that may be present in the JSON string
        json_str = json_str.replace('{{', '{').replace('}}', '}')
            
        try:
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError as e:
            raise ValueError("Extracted content is not valid JSON." + str(e))
        
    def image_inference(self, image_path: str, system_prompt: str) -> str:
        """
        Perform inference on an image.

        Args:
            image_path (str): Path to the image file.
            system_prompt (str): System prompt to guide the inference.

        Returns:
            str: The response from the model.
        """
        if not path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Read the image file as binary and encode it as base64
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode("utf-8")

        # Prepare the messages for the model
        messages = [
            {
                self.ROLE: Roles.SYSTEM,
                self.CONTENT: system_prompt
            },
            {
                self.ROLE: Roles.USER,
                self.CONTENT: f"Please analyze the attached image.\n\n[BASE64_IMAGE_START]{image_data}[BASE64_IMAGE_END]"
            }
        ]

        # Perform inference
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages
        )

        return response.choices[0].message.content
    
llm = LLM(model_name="gpt-4o", session="test_session")
# response = llm.chat(
#     system_prompt="You are a helpful assistant.",
#     user_prompt="Hello, how are you?"
# )
# print(response)

# response = llm.chat(
#     system_prompt="You are a helpful assistant.",
#     user_prompt="Can you summarize our previous conversation?"
# )
# print(response)
# response = llm.image_inference(
#     image_path=fr"decoded_image_Simarpreet Singh.jpg",
#     system_prompt="You are an expert image analyst. Describe the contents of the image in detail."
# )
# print(response)