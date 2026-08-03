from sqlalchemy.sql import func
from models import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    
    # Username is unique and required
    username = db.Column(
        db.String(100),
        unique=True, 
        nullable=False
    )

    # Email is unique and required
    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    # Storing hashed passwords securely
    password_hash = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=func.now()
    )

    # Password Reset
    reset_token = db.Column(
        db.String(255),
        nullable=True
    )

    reset_token_expiry = db.Column(
        db.DateTime(timezone=True),
        nullable=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "level": getattr(self, 'level', 1),
            "currentXP": getattr(self, 'current_xp', 0),
            "maxXP": getattr(self, 'max_xp', 10000),
            "coins": getattr(self, 'coins', 0),
            "streakDays": getattr(self, 'streak_days', 0),
            "friendsCount": getattr(self, 'friends_count', 0),
            "avatarUrl": getattr(self, 'avatar_url', "")
        }