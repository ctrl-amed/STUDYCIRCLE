from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
from models import db
from models.user import User
from routes.auth import auth
from utils.security import bcrypt
from utils.mail import mail
from utils.badges import award_badge
import json

# 1. Initialize App
app = Flask(__name__)

# 2. Set up CORS (Allows frontend to talk to backend securely)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])

# 3. Configurations
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = "studycircle_secret_key_2026"

# Security: Set token expiration time (e.g., users will be logged out after 30 minutes)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

# Mail Configurations
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "supportstudycircle@gmail.com"
app.config["MAIL_PASSWORD"] = "utpemiuldngtispu"
app.config["MAIL_DEFAULT_SENDER"] = "StudyCircle <supportstudycircle@gmail.com>"

# 4. Initialize Extensions with the app
db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)
jwt = JWTManager(app)

# 5. Register Blueprints (Routes from other files)
app.register_blueprint(auth)


# ========================================== #
# UTILITY FUNCTIONS                          #
# ========================================== #



# ========================================== #
# ROUTES                                     #
# ========================================== #

@app.route("/")
def home():
    return "<h1>Welcome to StudyCircle!</h1><p>Backend is connected.</p>"

@app.route("/login")
def login():
    return "<h2>Login Page</h2>"

@app.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    # 1. Get the identity from the secure JWT token
    current_user_identity = get_jwt_identity()
    
    # 2. Query your actual database for this specific user
    user = User.query.filter_by(id=int(current_user_identity)).first()
    
    # 3. Security check: If the user doesn't exist in the database, return an error
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # 4. Use the custom method to send the real data
    return jsonify(user.to_dict()), 200

@app.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    # 1. Get the identity from the secure JWT token
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))

    if not user:
        return jsonify({"message": "User not found."}), 404

    # 2. Get the updated data from the frontend
    data = request.get_json()

    # 3. Update Name, Username, and Email
    if 'name' in data:
        # If the user clears their name, it saves as an empty string
        user.name = data['name'].strip() if data['name'].strip() else ""
        
    if 'username' in data and data['username'].strip():
        user.username = data['username'].strip()

    if 'email' in data and data['email'].strip():
        user.email = data['email'].strip()

    # 4. Handle Password Change (if the user typed one in)
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if old_password and new_password:
        # Check if the old password matches the one in the database
        if bcrypt.check_password_hash(user.password_hash, old_password):
            user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        else:
            return jsonify({"message": "Incorrect old password."}), 400

    # 5. Save all changes to Supabase!
    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        db.session.rollback() # Undo if there's an error
        return jsonify({"message": "Database error", "error": str(e)}), 500

    
@app.route("/finish-session", methods=["POST"])
@jwt_required()
def finish_session():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))

    # 1. Update their stats (e.g., increase streak)
    user.streak_days += 1
    db.session.commit()

    # 2. Check for milestones and award badges!
    if user.streak_days == 7:
        award_badge(user.id, "media/badge2.png") # The 7-Day Streak Badge
        
    if user.friends_count == 1:
        award_badge(user.id, "media/badge3.png") # The Social Butterfly Badge

    return jsonify({"message": "Session complete!"}), 200


@app.route('/api/update-avatar', methods=['POST'])
@jwt_required()
def update_avatar():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    avatar_config = data.get('config')
    
    if not avatar_config:
        return jsonify({"error": "No avatar configuration provided"}), 400
        
    try:
        user.avatar_url = json.dumps(avatar_config) if isinstance(avatar_config, dict) else avatar_config
        db.session.commit()
        
        return jsonify({
            "message": "Avatar configuration saved successfully!",
            "avatar_url": user.avatar_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/update-room', methods=['POST'])
@jwt_required()
def update_room():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    room_config = data.get('config')
    
    if not room_config:
        return jsonify({"error": "No room configuration provided"}), 400
        
    try:
        # Assuming you store this in a column like room_url or room_config in your User model
        user.room_url = json.dumps(room_config) if isinstance(room_config, dict) else room_config
        db.session.commit()
        
        return jsonify({
            "message": "Room configuration saved successfully!",
            "room_url": user.room_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500        

# ========================================== #
# SERVER EXECUTION                           #
# ========================================== #

if __name__ == "__main__":
    with app.app_context():
        try:
            # Test the Supabase connection before starting the server
            db.session.execute(db.text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL!")
        except Exception as e:
            print("❌ Database connection failed:")
            print(e)

    app.run(debug=True)

