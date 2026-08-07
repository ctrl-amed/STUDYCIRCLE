from models import db
from sqlalchemy.sql import func
from models.user import User

class Room(db.Model):
    __tablename__ = "rooms"

    id = db.Column(db.BigInteger, primary_key=True)
    room_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.String(255), nullable=False)
    host_id = db.Column(db.BigInteger, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    players = db.Column(db.Integer, default=1)
    max_players = db.Column(db.Integer, default=6)
    visibility = db.Column(db.String(50), default='public')
    technique = db.Column(db.String(50), default='Pomodoro')
    checklist = db.Column(db.JSON, default=[])
    room_config = db.Column(db.JSON, default={})
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.room_code,
            "name": self.name,
            "topic": self.topic,
            "host": self.host.username if self.host else "You",
            "players": self.players,
            "maxPlayers": self.max_players,
            "dateCreated": self.created_at.strftime("%b %d, %Y") if self.created_at else "",
            "visibility": self.visibility,
            "technique": self.technique,
            "checklist": self.checklist,
            "roomConfig": self.room_config
        }

# Establish relationship in User model if needed
User.rooms = db.relationship('Room', backref='host', lazy=True, cascade="all, delete-orphan")
# Inside models/room.py
members = db.Column(db.JSON, default=[]) # Store list of joined users [{id, username, avatar}]