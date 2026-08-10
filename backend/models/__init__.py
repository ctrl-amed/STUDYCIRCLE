from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User, Message # Idagdag ang Message dito
from .room import Room