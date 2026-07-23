from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from utils.security import bcrypt

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

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
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

    return jsonify({
        "message": "Login successful!",
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

    # Generate secure reset token
    token = secrets.token_urlsafe(32)

    # Token expires in 15 minutes
    expiry = datetime.utcnow() + timedelta(minutes=15)

    user.reset_token = token
    user.reset_token_expiry = expiry

    db.session.commit()

    print("\n==============================")
    print("PASSWORD RESET TOKEN")
    print(token)
    print("==============================\n")

    return jsonify({
        "message": "Password reset request accepted."
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
            "message": "Invalid reset token."
        }), 404

    if user.reset_token_expiry is None or user.reset_token_expiry < datetime.utcnow():
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