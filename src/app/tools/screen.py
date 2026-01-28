from app.llm import LLM

class ScreeningTool():
    def __init__(self, session: str):
        
        self.SYSTEM_PROMPT_INITIAL: str = """
You are an expert onboarding assistant from NGO "Magic Bus" whose mission is to To equip vulnerable young people with life skills and employability training to break the cycle of poverty.
User will provide you with their personal details in a simple natural language format.
Your task is to analyse below user information about user's following details:
- Aadhar Number
- Date of Birth
- Education Level
- Parents' occupation
- Interests (job aspirations, hobbies)
- Previous experience if available
- Skills (technical, soft skills)

your response should be in the following format:
```json
{{
"Aadhar Number": "<Aadhar Number>",
"Date of Birth": "<Date of Birth> (YYYY-MM-DD)",
"Education Level": "<Education Level>",
"Parents' occupation": "<Parents' occupation>",
"Interests": "<Interests>",
"Previous experience": "<Previous experience>",
"Skills": "<Skills>"
}}
```

if some information is missing, please mention "Not Provided" for that field.

IMPORTANT:
- Ensure the output is valid JSON format as shown above.
- Do not include any explanations or additional text.
- Focus solely on extracting and formatting the information.
- Do not add any fields other than those specified.
- You can also use context which has session history.
- ALWWAYS INCLUDE ABOVE JSON OUTPUT IN YOUR RESPONSE IRRESPECTIVE IF DETAILS ARE PRESENT ARE NOT.
"""
        self.__session = session
        self.llm = LLM(model_name="gpt-4o", session=self.__session)

    def extract_user_info(self, user_input: str) -> dict:
        response = self.llm.chat(
            system_prompt=self.SYSTEM_PROMPT_INITIAL,
            user_prompt=user_input
        )

        extracted_json = self.llm.json_extractor(response)
        return extracted_json
    
    def onboard(self, user_input: str) -> tuple[dict, str, bool]:
        user_info = self.extract_user_info(user_input)

        followup_response_for_inputs = "Thanks for your information. But I noticed that some fields are missing. Please add the following details:\n"
        follow_up_neceassary = False
        successful_onboarding_message = "Thank you for providing all the necessary information. Your onboarding is now complete!\nPlease share your resume if available."

        for key, value in user_info.items():
            # print(f"{key}: {value}")
            field_provided = False if "Not Provided".lower() in value.lower() else True
            if not field_provided or follow_up_neceassary:
                follow_up_neceassary = True
            if not field_provided:
                followup_response_for_inputs += f"- {key}\n"

        print(followup_response_for_inputs)

        return user_info, successful_onboarding_message if not follow_up_neceassary else followup_response_for_inputs, follow_up_neceassary
    
# # Example usage:
# onboarding_tool = OnboardingTool(session="onboarding_session")
# user_input = """My Aadhar number is 1234-5678-9012. I have completed my high school education. My father is a farmer and my mother is a homemaker. I am interested in pursuing a career in computer science and I enjoy playing football. I have previously interned at a local IT firm. My skills include basic programming in Python and good communication skills."""

# print(onboarding_tool.onboard(user_input))