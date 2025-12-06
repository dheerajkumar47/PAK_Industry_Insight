from datetime import datetime

class UserModel:
    def __init__(self, email, hashed_password, full_name=None):
        self.email = email
        self.hashed_password = hashed_password
        self.full_name = full_name
        self.created_at = datetime.utcnow()
        self.disabled = False
        self.email_notifs = True
        self.push_notifs = False
