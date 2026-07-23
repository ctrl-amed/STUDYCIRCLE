from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from utils.security import bcrypt

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