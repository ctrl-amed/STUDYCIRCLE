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

    # Full Name (Starts blank/nullable since sign-up only asks for username/email)
    name = db.Column(
        db.String(150),
        nullable=True
    )

    # Dashboard & Profile Game Stats
    level = db.Column(db.Integer, default=1)
    current_xp = db.Column(db.Integer, default=0)
    max_xp = db.Column(db.Integer, default=10000)
    coins = db.Column(db.Integer, default=0)
    streak_days = db.Column(db.Integer, default=0)
    friends_count = db.Column(db.Integer, default=0)
    avatar_url = db.Column(db.Text, nullable=True, default="")
    room_url = db.Column(db.Text, nullable=True, default="")
    badges = db.Column(db.Text, nullable=True, default="")
# Detailed Game Stats
    total_study_hours = db.Column(db.Float, default=0.0)
    rooms_created = db.Column(db.Integer, default=0)
    avg_quiz_score = db.Column(db.Integer, default=0)
    best_streak = db.Column(db.Integer, default=0)
    lifetime_coins = db.Column(db.Integer, default=0)
    

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

    rooms = db.relationship('Room', backref='host', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name if self.name else "", 
            "level": self.level,
            "currentXP": self.current_xp,
            "maxXP": self.max_xp,
            "coins": self.coins,
            "streakDays": self.streak_days,
            "friendsCount": self.friends_count,
            "avatarUrl": self.avatar_url or "",
            "roomUrl": self.room_url or "",
            "badges": self.badges.split(",") if self.badges else [],
            
            # 👇 Add these new lines right here!
            "totalStudyHours": self.total_study_hours,
            "roomsCreated": self.rooms_created,
            "avgQuizScore": self.avg_quiz_score,
            "bestStreak": self.best_streak,
            "lifetimeCoins": self.lifetime_coins
        }