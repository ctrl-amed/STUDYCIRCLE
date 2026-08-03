from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from utils.security import bcrypt

from flask_mail import Message
from utils.mail import mail

from flask_jwt_extended import create_access_token

import secrets
from datetime import datetime, timedelta

auth = Blueprint("auth", __name__)


# ------------------------
# REGISTER
# ------------------------
@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({
            "message": "All fields are required."
        }), 400

    # 1. Check if Username already exists (Cleaned up syntax)
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
        return jsonify({
            "message": "Username is already taken."
        }), 409

    # 2. Check if Email already exists
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({
            "message": "Email already exists."
        }), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully!"
    }), 201


# ------------------------
# LOGIN
# ------------------------
@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({
            "message": "Invalid email or password."
        }), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful!",
        "token": access_token,
        "username": user.username,
        "email": user.email
    }), 200


# ------------------------
# FORGOT PASSWORD
# ------------------------
@auth.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()

    email = data.get("email")

    if not email:
        return jsonify({
            "message": "Email is required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "message": "Email address not found."
        }), 404

    # Generate secure token
    token = secrets.token_urlsafe(32)

    # Expires in 15 minutes
    expiry = datetime.utcnow() + timedelta(minutes=15)

    user.reset_token = token
    user.reset_token_expiry = expiry

    db.session.commit()

    # Change this when deployed
    reset_link = f"http://127.0.0.1:5500/changepassword.html?token={token}"

    msg = Message(
        subject="Reset your StudyCircle Password",
        recipients=[user.email]
    )

    msg.body = f"""
Hello {user.username},

We received a request to reset your StudyCircle password.

Click the link below to reset your password:

{reset_link}

This link expires in 15 minutes.

If you didn't request this, simply ignore this email.

- StudyCircle Team
"""

    mail.send(msg)

    return jsonify({
        "message": "Password reset link sent successfully."
    }), 200


# ------------------------
# RESET PASSWORD
# ------------------------
@auth.route("/reset-password", methods=["POST"])
def reset_password():

    data = request.get_json()

    token = data.get("token")
    password = data.get("password")

    if not token or not password:
        return jsonify({
            "message": "Token and new password are required."
        }), 400

    user = User.query.filter_by(reset_token=token).first()

    if user is None:
        return jsonify({
            "message": "Invalid or expired reset token."
        }), 400

    if (
        user.reset_token_expiry is None or
        user.reset_token_expiry < datetime.utcnow()
    ):
        return jsonify({
            "message": "Reset token has expired."
        }), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user.password_hash = hashed_password
    user.reset_token = None
    user.reset_token_expiry = None

    db.session.commit()

    return jsonify({
        "message": "Password reset successful."
    }), 200