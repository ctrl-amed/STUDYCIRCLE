from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
from models import db
from models.user import User
from models.room import Room
from routes.auth import auth
from utils.security import bcrypt
from utils.mail import mail
from utils.badges import award_badge
import json

# ========================================== #
# IN-MEMORY STORE FOR REAL-TIME PLAYERS      #
# ========================================== #
# Tracks active users in rooms without altering DB schema
# Format: { "ROOM-CODE": [ {"id": 1, "username": "User1", "avatar_url": "{...}"} ] }
ACTIVE_ROOM_SESSIONS = {}

# 1. Initialize App
app = Flask(__name__)

# 2. Set up CORS
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# 3. Configurations
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = "studycircle_secret_key_2026"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "supportstudycircle@gmail.com"
app.config["MAIL_PASSWORD"] = "utpemiuldngtispu"
app.config["MAIL_DEFAULT_SENDER"] = "StudyCircle <supportstudycircle@gmail.com>"

# 4. Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)
jwt = JWTManager(app)

# 5. Register Blueprints
app.register_blueprint(auth)

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
    current_user_identity = get_jwt_identity()
    user = User.query.filter_by(id=int(current_user_identity)).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@app.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"message": "User not found."}), 404

    data = request.get_json()
    if 'name' in data:
        user.name = data['name'].strip() if data['name'].strip() else ""
    if 'username' in data and data['username'].strip():
        user.username = data['username'].strip()
    if 'email' in data and data['email'].strip():
        user.email = data['email'].strip()

    old_password = data.get('old_password')
    new_password = data.get('new_password')
    if old_password and new_password:
        if bcrypt.check_password_hash(user.password_hash, old_password):
            user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        else:
            return jsonify({"message": "Incorrect old password."}), 400

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(e)}), 500

@app.route("/finish-session", methods=["POST"])
@jwt_required()
def finish_session():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    user.streak_days += 1
    db.session.commit()

    if user.streak_days == 7:
        award_badge(user.id, "media/badge2.png")
    if user.friends_count == 1:
        award_badge(user.id, "media/badge3.png")

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
        # I-save sa database
        user.avatar_url = json.dumps(avatar_config) if isinstance(avatar_config, dict) else avatar_config
        db.session.commit()
        
        # SUPER IMPORTANT: I-update din ang Live Room Session memory para makita agad ng ibang players!
        for room_code, players in ACTIVE_ROOM_SESSIONS.items():
            for p in players:
                if p['id'] == user.id:
                    p['avatar_url'] = user.avatar_url
                    
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
        user.room_url = json.dumps(room_config) if isinstance(room_config, dict) else room_config
        db.session.commit()
        return jsonify({"message": "Room configuration saved successfully!", "room_url": user.room_url}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500      

@app.route('/api/create-room', methods=['POST'])
@jwt_required()
def create_room():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    room_code = data.get('id')
    
    try:
        new_room = Room(
            room_code=room_code,
            name=data.get('name'),
            topic=data.get('topic'),
            host_id=user.id,
            players=1,
            max_players=data.get('maxPlayers', 6),
            visibility=data.get('visibility', 'public'),
            technique=data.get('technique', 'Pomodoro'),
            checklist=data.get('checklist', []),
            room_config=data.get('roomConfig', {})
        )
        db.session.add(new_room)
        user.rooms_created = (user.rooms_created or 0) + 1
        db.session.commit()
        
        # Add Host to the real-time active sessions
        user_data = {"id": user.id, "username": user.username or user.name, "avatar_url": user.avatar_url}
        ACTIVE_ROOM_SESSIONS[room_code] = [user_data]
        
        return jsonify({
            "message": "Room created successfully!",
            "room": new_room.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/rooms', methods=['GET'])
@jwt_required()
def get_rooms():
    try:
        rooms = Room.query.all()
        rooms_list = []
        for room in rooms:
            r_dict = room.to_dict()
            
            # SAFETY CHECK: Siguraduhing laging nasa live session ang Host
            # Kapag nag-restart ang server, ibabalik nito ang Host sa loob ng sarili niyang room.
            session_players = ACTIVE_ROOM_SESSIONS.get(room.room_code, [])
            if not any(p.get('id') == room.host_id for p in session_players):
                host = User.query.get(room.host_id)
                if host:
                    host_data = {"id": host.id, "username": host.username or host.name, "avatar_url": host.avatar_url}
                    session_players.insert(0, host_data) # Ilagay ang host sa pinakaunang listahan
                    ACTIVE_ROOM_SESSIONS[room.room_code] = session_players
                    
            r_dict['players_list'] = session_players
            rooms_list.append(r_dict)
            
        return jsonify({"rooms": rooms_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/join-room', methods=['POST'])
@jwt_required()
def join_room_api():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        data = request.get_json()
        invite_code = data.get('inviteCode')
        
        if not invite_code:
            return jsonify({"message": "Room code is required."}), 400
            
        room = Room.query.filter_by(room_code=invite_code.strip().upper()).first()
        if not room:
            return jsonify({"message": "Invalid room code."}), 404
            
        # Add Joining User to real-time active sessions
        if room.room_code not in ACTIVE_ROOM_SESSIONS:
            ACTIVE_ROOM_SESSIONS[room.room_code] = []
            
        user_data = {"id": user.id, "username": user.username or user.name, "avatar_url": user.avatar_url}
        
        # Prevent duplicates if they click join multiple times
        if not any(p['id'] == user.id for p in ACTIVE_ROOM_SESSIONS[room.room_code]):
            ACTIVE_ROOM_SESSIONS[room.room_code].append(user_data)
            
            # Update player count in DB
            room.players = len(ACTIVE_ROOM_SESSIONS[room.room_code])
            db.session.commit()
            
        return jsonify({
            "message": "Successfully joined room!",
            "room": room.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Server error", "error": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        try:
            db.session.execute(db.text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL!")
        except Exception as e:
            print("❌ Database connection failed:")
            print(e)
    app.run(debug=True)