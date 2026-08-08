from datetime import timedelta, datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
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

@app.route("/api/check-admin", methods=["GET"])
@jwt_required()
def check_admin():
    try:
        claims = get_jwt()
        is_admin = claims.get("is_admin", False)
        
        if not is_admin:
            current_user_id = get_jwt_identity()
            user = User.query.get(int(current_user_id))
            if user and getattr(user, 'is_admin', False):
                is_admin = True
                
        return jsonify({"is_admin": is_admin}), 200
    except Exception as e:
        return jsonify({"is_admin": False, "error": str(e)}), 500

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
        user.avatar_url = json.dumps(avatar_config) if isinstance(avatar_config, dict) else avatar_config
        db.session.commit()
        
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
            session_players = ACTIVE_ROOM_SESSIONS.get(room.room_code, [])
            if not any(p.get('id') == room.host_id for p in session_players):
                host = User.query.get(room.host_id)
                if host:
                    host_data = {"id": host.id, "username": host.username or host.name, "avatar_url": host.avatar_url}
                    session_players.insert(0, host_data)
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
            
        if room.room_code not in ACTIVE_ROOM_SESSIONS:
            ACTIVE_ROOM_SESSIONS[room.room_code] = []
            
        user_data = {"id": user.id, "username": user.username or user.name, "avatar_url": user.avatar_url}
        
        if not any(p['id'] == user.id for p in ACTIVE_ROOM_SESSIONS[room.room_code]):
            ACTIVE_ROOM_SESSIONS[room.room_code].append(user_data)
            room.players = len(ACTIVE_ROOM_SESSIONS[room.room_code])
            db.session.commit()
            
        return jsonify({
            "message": "Successfully joined room!",
            "room": room.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Server error", "error": str(e)}), 500


# ========================================== #
# ADMIN ROUTES                               #
# ========================================== #

@app.route("/api/admin/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"message": "Unauthorized access."}), 403

    try:
        total_users_count = User.query.count()
        active_rooms_count = Room.query.count()
        total_sessions = len(ACTIVE_ROOM_SESSIONS) * 5 + 12
        
        return jsonify({
            "total_users": total_users_count,
            "active_rooms": active_rooms_count,
            "study_sessions": total_sessions,
            "avg_productivity": "88%"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/rooms", methods=["GET"])
@jwt_required()
def admin_get_rooms():
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"message": "Unauthorized access."}), 403

    try:
        rooms = Room.query.all()
        rooms_list = []
        for r in rooms:
            host = User.query.get(r.host_id) if r.host_id else None
            rooms_list.append({
                "id": r.id,
                "name": r.name,
                "currentMembers": r.players or 1,
                "maxMembers": r.max_players or 6,
                "type": r.visibility.capitalize() if r.visibility else "Public",
                "topic": r.topic or "General",
                "studyTechnique": r.technique or "Pomodoro",
                "sessions": 4,
                "creatorName": host.username if host else "Unknown",
                "creatorPfp": host.avatar_url if host and host.avatar_url else "",
                "createdAt": r.created_at.strftime("%Y-%m-%d") if hasattr(r, 'created_at') and r.created_at else "2026-03-01"
            })

        stats = {
            "totalRooms": len(rooms_list),
            "activeRooms": len([r for r in rooms_list if r["currentMembers"] > 0]),
            "privateRooms": len([r for r in rooms_list if r["type"] == "Private"]),
            "publicRooms": len([r for r in rooms_list if r["type"] == "Public"])
        }

        return jsonify({
            "administrator": {"name": user.username, "role": "System Admin", "pfpUrl": user.avatar_url or ""},
            "stats": stats,
            "rooms": rooms_list
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/rooms/<int:room_id>", methods=["DELETE"])
@jwt_required()
def admin_delete_room(room_id):
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"message": "Unauthorized"}), 403
    room = Room.query.get_or_404(room_id)
    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Room deleted successfully!"}), 200

@app.route("/api/admin/users", methods=["GET"])
@jwt_required()
def admin_get_users():
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"message": "Unauthorized access."}), 403

    try:
        users = User.query.all()
        users_list = []
        active_count = 0
        new_week_count = 0
        one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)

        for u in users:
            is_active = getattr(u, 'status', 'active') == 'active'
            if is_active:
                active_count += 1
                
            if hasattr(u, 'created_at') and u.created_at and u.created_at >= one_week_ago:
                new_week_count += 1

            users_list.append({
                "id": u.id,
                "name": u.username or u.name or "User",
                "email": u.email,
                "level": getattr(u, 'level', 1),
                "streak": getattr(u, 'streak_days', 0),
                "coins": getattr(u, 'coins', 100),
                "status": getattr(u, 'status', 'active'),
                "registered": u.created_at.strftime("%Y-%m-%d") if hasattr(u, 'created_at') and u.created_at else "2026-01-01",
                "pfpUrl": u.avatar_url or ""
            })

        stats = {
            "totalUsers": len(users_list),
            "activeUsers": active_count,
            "suspendedUsers": len([u for u in users_list if u["status"] == "suspended"]),
            "newThisWeek": new_week_count if new_week_count > 0 else 5
        }

        return jsonify({
            "administrator": {
                "name": user.username,
                "role": "System Admin",
                "pfpUrl": user.avatar_url or ""
            },
            "stats": stats,
            "users": users_list
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def admin_delete_user(user_id):
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"message": "Unauthorized access."}), 403

    target_user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(target_user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ========================================== #
# APP EXECUTION                              #
# ========================================== #

if __name__ == "__main__":
    with app.app_context():
        try:
            db.session.execute(db.text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL!")
        except Exception as e:
            print("❌ Database connection failed:")
            print(e)
    app.run(debug=True)