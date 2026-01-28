# from sqlite.database import Database
from app.models.User import User, UserInfo
from app.database import Database
class UserRepository:
    def __init__(self, db_path: str = 'app/apac_data.db'):
        self.db = Database(db_path)

    def add_user(self, user_info: dict):
        """Adds a new user to the users table."""
        self.db.insert_data('users', {
                    "name": user_info[User.NAME],
                    "phone_number": user_info[User.PHONE_NUMBER],
                    "aadhaar_number": user_info.get(UserInfo.AADHAR_NUMBER, 'Not Provided'),
                    "date_of_birth": user_info.get(UserInfo.DATE_OF_BIRTH, 'Not Provided'),
                    "education_level": user_info.get(UserInfo.EDUCATION_LEVEL, 'Not Provided'),
                    "parents_occupation": user_info.get(UserInfo.PARENTS_OCCUPATION, 'Not Provided'),
                    "interests": user_info.get(UserInfo.INTERESTS, 'Not Provided'),
                    "previous_experience": user_info.get(UserInfo.PREVIOUS_EXPERIENCE, 'Not Provided'),
                    "skills": user_info.get(UserInfo.SKILLS, 'Not Provided')
                })
        return "Inserted Scuccessfully"

