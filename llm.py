from os import getenv, path, makedirs
from dotenv import load_dotenv
from openai import AzureOpenAI
# from app.models.env import Environment
import re
import json

class Roles:
    SYSTEM: str = "system"
    USER: str = "user"
    ASSISTANT: str = "assistant"


class LLM():

    def __init__(self, model_name: str):

        load_dotenv()

        self.__model: str = model_name
        
        # self.__session_path: str = path.join("inference", session+".txt")
        # makedirs(path.dirname(self.__session_path), exist_ok=True)


        self.CONTENT: str = "content"
        self.ROLE: str = "role"

        self.__client = AzureOpenAI(
            api_key = getenv("AZURE_API_KEY", ''),
            azure_endpoint = getenv("AZURE_ENDPOINT", ''),
            api_version = "2024-02-01"
        )

    def chat(self, system_prompt: str, user_prompt: str) -> str:

        # context = self.__get_session_context()

        messages = [
            {
                self.ROLE: Roles.SYSTEM,
                self.CONTENT: system_prompt
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

        # self.__push_to_session(Roles.USER, user_prompt)
        # self.__push_to_session(Roles.ASSISTANT, response.choices[0].message.content)

        return response.choices[0].message.content
    
    def __push_to_session(self, role: str, content: str) -> None:
        with open(self.__session_path, "a") as file:
            file.write(f"Role: {role}\nContent: {content}\n\n\n")

    def __get_session_context(self) -> str:
        if not path.exists(self.__session_path):
            return ""
        
        with open(self.__session_path, "r") as file:
            return file.read()
        
    def __json_extractor(self, text: str) -> dict:

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
            
        try:
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError as e:
            raise ValueError("Extracted content is not valid JSON." + str(e))
        
# llm = LLM(model_name="gpt-4o", session="test_session")
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