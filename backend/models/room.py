from sqlalchemy.sql import func
from models import db
import json # Make sure to import json at the top of room.py
from datetime import datetime # Make sure to import datetime

class Room(db.Model):
    __tablename__ = "rooms"
    __table_args__ = {'extend_existing': True}

    # Eksaktong mga column na nasa database mo:
    id = db.Column(db.BigInteger, primary_key=True)
    room_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.String(255), nullable=False)
    host_id = db.Column(db.BigInteger, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    players = db.Column(db.Integer, default=1)
    max_players = db.Column(db.Integer, default=6)
    visibility = db.Column(db.String(50), default='public')
    technique = db.Column(db.String(50), default='Pomodoro')
    checklist = db.Column(db.JSON, default=list)
    room_config = db.Column(db.JSON, default=dict) # Dito natin ilalagay ang room_mode, sessions, at pdf info!
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        # 1. Safely handle JSON strings if the database returns a string instead of a dict
        config = self.room_config
        if isinstance(config, str):
            try:
                config = json.loads(config)
            except:
                config = {}
        if not config:
            config = {}

        # 2. Safely handle the date formatting
        date_str = ""
        if self.created_at:
            if isinstance(self.created_at, str):
                # If it came back as a string, just use it or slice it
                date_str = self.created_at[:10] 
            else:
                # If it's a true datetime object
                date_str = self.created_at.strftime("%b %d, %Y")

        return {
            "id": self.id,
            "roomCode": self.room_code,
            "name": self.name,
            "topic": self.topic,
            "host": self.host.username if self.host else "Unknown",
            "players": self.players,
            "maxPlayers": self.max_players,
            "visibility": self.visibility,
            "technique": self.technique,
            "checklist": self.checklist if isinstance(self.checklist, list) else [],
            "roomMode": config.get("roomMode", "structured"),
            "sessions": config.get("sessions", 1),
            "pdfFilename": config.get("pdfFilename", ""),
            "roomConfig": config,
            "dateCreated": date_str
        }