from app.whatsapp import WhatsAppClient
from app.tools.onboarding import OnboardingTool
from app.models.User import User, UserInfo

from app.repository import UserRepository
class Orchestrator():
    def __init__(self):
        self.__whatsapp_client = WhatsAppClient()
        self.Repository=UserRepository()
        self.messages: list[dict] = []
        self.messages_to_process = []
        self.users_to_load = []


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

    def load(self):
        for user in self.users_to_load:
            self.followup(user[User.PHONE_NUMBER], user[User.NAME], "You are now onboarded on Magic Bus!!!")
            print()
            print()
            print()
            print(user)
            self.Repository.add_user(user)
            print()
            print()
            print()


    def followup(self, phone_number: str, name: str, message: str):
        self.__whatsapp_client.send_text(to=phone_number, content= f"Hi {name},\n{message}")

    def run(self):
        self.extract()
        self.transform()
        self.load()

orc = Orchestrator()
orc.run()