from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    location = db.Column(db.String(100))
    skin_tone = db.Column(db.String(50))
    allergies = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "location": self.location,
            "skin_tone": self.skin_tone,
            "allergies": self.allergies,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password, password)
