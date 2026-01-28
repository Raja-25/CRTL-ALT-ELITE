from app.whatsapp import WhatsAppClient
from app.tools.onboarding import OnboardingTool
from app.tools.screen import ScreeningTool
from app.models.User import User, UserInfo
from app.repository import UserRepository

class Orchestrator():
    def __init__(self):
        self.__whatsapp_client = WhatsAppClient()
        self.Repository=UserRepository()
        self.messages: list[dict] = []
        self.messages_to_process = []
        self.users_to_load = []
        self.images_to_process = []
        self.screening_results = []


    def extract(self):

        messages = self.__whatsapp_client.get_messages()
        
        # messages = response.get('response', [])

        for message in messages:

            if message.get('type', '') == 'chat':
                self.messages_to_process.append({
                    User.NAME: message.get('notifyName', 'Name'),
                    User.PHONE_NUMBER: message.get('from', 'PhoneNumber'),
                    User.MESSAGE: message.get('body', 'Message')
                })

            elif message.get('type', '') == 'image':
                image_path = self.__whatsapp_client.save_image(message, session=message.get('notifyName', 'Name'))
                self.images_to_process.append((message.get('notifyName', 'Name'), image_path, message.get('from', 'PhoneNumber')))

    def transform(self):
        
        for message in self.messages_to_process:

            if message[User.PHONE_NUMBER] == '919146623526@c.us':
                continue

            onboarding_tool = OnboardingTool(session=message[User.NAME])
            user_info, followup_message, needs_followup = onboarding_tool.onboard(message[User.MESSAGE])

            if not needs_followup:
                self.users_to_load.append({
                    User.NAME: message[User.NAME],
                    User.PHONE_NUMBER: message[User.PHONE_NUMBER],
                    User.AADHAR_NUMBER: user_info.get(UserInfo.AADHAR_NUMBER, 'Not Provided'),
                    User.DATE_OF_BIRTH: user_info.get(UserInfo.DATE_OF_BIRTH, 'Not Provided'),
                    User.EDUCATION_LEVEL: user_info.get(UserInfo.EDUCATION_LEVEL, 'Not Provided'),
                    User.PARENTS_OCCUPATION: user_info.get(UserInfo.PARENTS_OCCUPATION, 'Not Provided'),
                    User.INTERESTS: user_info.get(UserInfo.INTERESTS, 'Not Provided'),
                    User.PREVIOUS_EXPERIENCE: user_info.get(UserInfo.PREVIOUS_EXPERIENCE, 'Not Provided'),
                    User.SKILLS: user_info.get(UserInfo.SKILLS, 'Not Provided')
                })

            else:
                self.followup(
                    phone_number=message[User.PHONE_NUMBER],
                    name=message[User.NAME],
                    message=followup_message
                )

        for name, image_path, number in self.images_to_process:
            screening_tool = ScreeningTool(session=name)
            score, analysis_message = screening_tool.analyze_image(session=name)
            self.screening_results.append({
                "name": name,
                "score": score,
                "message": analysis_message,
                "phone_number": number
            })


    def load(self):
        for user in self.users_to_load:
            self.followup(user[User.PHONE_NUMBER], user[User.NAME], "You are now in process of being onboarded. Please send a clear picture of your Aadhar card for verification.")
            print()
            print()
            print()
            print(user)
            try:
                self.Repository.add_user(user)
            except Exception as e:
                print(f"Error adding user {user[User.NAME]}: {str(e)}")
            print()
            print()
            print()

        for result in self.screening_results:
            self.followup(
                phone_number=result["phone_number"],
                name=result["name"],
                message=result["message"]
            )


    def followup(self, phone_number: str, name: str, message: str):
        self.__whatsapp_client.send_text(to=phone_number, content= f"Hi {name},\n{message}")

    def run(self):
        self.extract()
        self.transform()
        self.load()

orc = Orchestrator()
orc.run()