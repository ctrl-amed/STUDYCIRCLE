from models import db
from sqlalchemy.sql import func


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True)

    username = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

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
            # If you don't have these columns in your database yet, 
            # we can hardcode default fallback values for now:
            "level": getattr(self, 'level', 1),
            "currentXP": getattr(self, 'current_xp', 0),
            "maxXP": getattr(self, 'max_xp', 10000),
            "coins": getattr(self, 'coins', 0),
            "streakDays": getattr(self, 'streak_days', 0),
            "friendsCount": getattr(self, 'friends_count', 0),
            "avatarUrl": getattr(self, 'avatar_url', "")
        }