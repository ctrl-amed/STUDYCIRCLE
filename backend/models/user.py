from sqlalchemy.sql import func
from models import db

# Association table for Friendships
friendships = db.Table('friendships',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    name = db.Column(db.String(150), nullable=True)

    # Dashboard & Profile Game Stats
    level = db.Column(db.Integer, default=1)
    current_xp = db.Column(db.Integer, default=0)
    max_xp = db.Column(db.Integer, default=10000)
    coins = db.Column(db.Integer, default=100)
    streak_days = db.Column(db.Integer, default=0)
    friends_count = db.Column(db.Integer, default=0)
    avatar_url = db.Column(db.Text, nullable=True, default="")
    room_url = db.Column(db.Text, nullable=True, default="")
    badges = db.Column(db.Text, nullable=True, default="")
    
    # Inventory column correctly placed inside User model
    inventory = db.Column(db.JSON, default=list)
    
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

    # Admin Flag
    is_admin = db.Column(
        db.Boolean,
        default=False,
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
    coins = db.Column(db.Integer, default=100)
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

    # Relationships
    rooms = db.relationship('Room', backref='host', lazy=True, cascade="all, delete-orphan")
    
    # Self-referential relationship for friends
    friends = db.relationship(
        'User',
        secondary=friendships,
        primaryjoin=(friendships.c.user_id == id),
        secondaryjoin=(friendships.c.friend_id == id),
        lazy='subquery'
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "isAdmin": self.is_admin,
            "name": self.name if self.name else "", 
            "level": self.level,
            "currentXP": self.current_xp,
            "maxXP": self.max_xp,
            "coins": self.coins,
            "inventory": self.inventory if self.inventory else [],
            "streakDays": self.streak_days,
            "friendsCount": self.friends_count,
            "avatarUrl": self.avatar_url or "",
            "roomUrl": self.room_url or "",
            "badges": self.badges.split(",") if self.badges else [],
            "totalStudyHours": self.total_study_hours,
            "roomsCreated": self.rooms_created,
            "avgQuizScore": self.avg_quiz_score,
            "bestStreak": self.best_streak,
            "lifetimeCoins": self.lifetime_coins
        }


class Message(db.Model):
    __tablename__ = "messages"
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "text": self.text,
            "created_at": self.created_at.isoformat()
        }