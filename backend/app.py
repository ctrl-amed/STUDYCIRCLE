from datetime import timedelta, datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
from config import Config
from models import db
from models.user import User, Message  # Included the Message model here
from models.room import Room
from routes.auth import auth
from utils.security import bcrypt
from utils.mail import mail
from utils.badges import award_badge
import json
import os
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from google import genai
from google.genai import types

# 1. Initialize App first
app = Flask(__name__)

# 2. Initialize Flask-Migrate right after app creation
migrate = Migrate(app, db)


# ========================================== #
# IN-MEMORY STORE FOR REAL-TIME PLAYERS & AI #
# ========================================== #
ACTIVE_ROOM_SESSIONS = {}
ACTIVE_ROOM_TIMERS = {}
UPLOADED_TEXTS = {} # This is where we'll save the PDF text for Gemini to read

# 2. Set up CORS properly
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
# GEMINI API CLIENT SETUP                    #
# ========================================== #
# Initialize the new google-genai client
api_key = os.getenv("GEMINI_API_KEY")

# Define upload folder configuration
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    
    user_data = user.to_dict()
    # Ensure real coins and inventory from the database are always included
    user_data["coins"] = getattr(user, 'coins', 0)
    user_data["inventory"] = getattr(user, 'inventory', [])
    
    return jsonify(user_data), 200

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

@app.route('/api/update-avatar', methods=['POST'])
@jwt_required()
def update_avatar():
    current_user_identity = get_jwt_identity()
    user = User.query.get(int(current_user_identity))
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    avatar_config = data.get('config')
    new_coins = data.get('coins')
    new_inventory = data.get('inventory')
    
    try:
        if avatar_config is not None:
            user.avatar_url = json.dumps(avatar_config) if isinstance(avatar_config, dict) else avatar_config
            
        if new_coins is not None:
            user.coins = int(new_coins)

        if new_inventory is not None:
            user.inventory = new_inventory

        db.session.commit()
        
        return jsonify({
            "message": "Avatar configuration, coins, and inventory saved successfully!",
            "avatar_url": user.avatar_url,
            "coins": user.coins,
            "inventory": user.inventory
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
# KITSU AI ROUTES                            #
# ========================================== #        

@app.route("/api/kitsu-ai/chat", methods=["POST"])
# @jwt_required() # NAKA-COMMENT MUNA PARA MAKA-TEST KAHIT WALANG LOGIN
def kitsu_ai_chat():
    data = request.get_json()
    
    if not data or "message" not in data:
        return jsonify({"error": "Message cannot be empty"}), 400
        
    user_message = data.get("message", "").strip()
    
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    try:
        # Simpleng prompt dahil wala muna tayong user data
        prompt = f"You are Kitsu AI, a friendly and helpful study buddy pixel-art fox. Keep answers short, fun, and concise. The user says: {user_message}"
        
        response = gemini_client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt
        )
        
        return jsonify({
            "response": response.text
        }), 200
        
    except Exception as e:
        # ITO ANG PINAKAMAHALAGA: Ipi-print nito ang totoong error sa terminal mo
        print("\n" + "="*50)
        print("🚨 GEMINI CHAT ERROR:")
        print(e)
        print("="*50 + "\n")
        return jsonify({"error": "Kitsu AI is currently resting. Try again later!"}), 500
    
@app.route("/api/upload-source", methods=["POST"])
# @jwt_required()  # NAKA-COMMENT PARA SA TESTING
def upload_source():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.lower().endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        extracted_text = ""
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        except Exception as e:
            return jsonify({"error": f"Failed to parse PDF text: {str(e)}"}), 500
            
        file_size_bytes = os.path.getsize(file_path)
        file_size_mb = f"{file_size_bytes / (1024 * 1024):.1f} MB"
        
        # Create a unique ID and store the text in our dictionary
        file_id = str(os.urandom(4).hex())
        UPLOADED_TEXTS[file_id] = extracted_text
        
        return jsonify({
            "message": "File uploaded and parsed successfully!",
            "file": {
                "id": file_id,
                "name": filename,
                "size": file_size_mb,
                "addedBy": "Guest User", # Pinalitan muna natin dahil walang login
                "textLength": len(extracted_text)
            }
        }), 201
        
    return jsonify({"error": "Invalid file format. Only PDF files are supported."}), 400

@app.route("/api/generate-tool", methods=["POST"])
@jwt_required()
def generate_tool():
    data = request.get_json()
    tool_type = data.get("toolType")
    selected_file_ids = data.get("fileIds", [])
    
    # Retrieve and combine the text from the selected PDFs
    combined_text = ""
    for fid in selected_file_ids:
        if fid in UPLOADED_TEXTS:
            combined_text += UPLOADED_TEXTS[fid] + "\n\n"
            
    if not combined_text.strip():
        return jsonify({"error": "No valid text found in the selected documents."}), 400
        
    try:
        # Set up strict system instructions based on the requested tool
        if tool_type in ["Pre-quiz", "Post-quiz"]:
            system_instruction = f"""Based on the following document text, generate a 5-question multiple choice quiz.
Return ONLY a valid JSON object. Exact structure required:
{{
    "topic": "Document Topic Here",
    "sourcesCount": {len(selected_file_ids)},
    "totalQuestions": 5,
    "questions": [
        {{"id": 1, "question": "Question here?", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "correctAnswer": 0}}
    ]
}}

Document Text:
{combined_text[:30000]}""" # Limit the text size for faster processing
            
        elif tool_type == "Flashcards":
            system_instruction = f"""Based on the following document text, generate 5 study flashcards of key terms.
Return ONLY a valid JSON object. Exact structure required:
{{
    "topic": "Document Topic Here",
    "sourcesCount": {len(selected_file_ids)},
    "cards": [
        {{"id": 1, "term": "Term Name", "definition": "Clear definition here"}}
    ]
}}

Document Text:
{combined_text[:30000]}"""
            
        else: # Notes
            system_instruction = f"""Based on the following document text, generate structured study notes.
Return ONLY a valid JSON object. Exact structure required:
{{
    "topic": "Document Topic Here",
    "sourcesCount": {len(selected_file_ids)},
    "notesContent": [
        {{"heading": "Section Heading", "body": "Paragraph summary", "bullets": ["Key point 1", "Key point 2"]}}
    ]
}}

Document Text:
{combined_text[:30000]}"""

        # Generate content using the new Google GenAI SDK with JSON configuration
        response = gemini_client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=system_instruction,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Parse the JSON returned by Gemini
        generated_data = json.loads(response.text)
        
        # Format the wrapper payload expected by your frontend
        badge_color = "bg-[#E34B00]" # Default (Notes)
        if tool_type == "Pre-quiz":
            badge_color = "bg-[#788D55]"
        elif tool_type == "Post-quiz":
            badge_color = "bg-[#708EA4]"
        elif tool_type == "Flashcards":
            badge_color = "bg-[#A53914]"

        payload = {
            "title": generated_data.get("topic", f"AI {tool_type}"),
            "type": tool_type,
            "badgeColor": badge_color
        }

        # Attach the correct state property required by kitsuai.js
        if tool_type in ["Pre-quiz", "Post-quiz"]:
            payload["quizState"] = {
                "activeQuiz": generated_data,
                "currentQuestionIndex": 0,
                "userAnswers": {},
                "isCompleted": False,
                "isReviewing": False
            }
        elif tool_type == "Flashcards":
            generated_data["currentIndex"] = 0
            generated_data["isFlipped"] = False
            generated_data["isListView"] = False
            payload["flashcardState"] = generated_data
        else:
            payload["notesState"] = generated_data
            
        return jsonify(payload), 200

    except Exception as e:
        print("Gemini Generate Error:", e)
        return jsonify({"error": "Failed to generate tool from AI."}), 500
    
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
# FRIENDS & CHAT API ROUTES                  #
# ========================================== #

@app.route("/api/friends", methods=["GET"])
@jwt_required()
def get_friends():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    friends_data = [{
        "id": f.id,
        "name": f.username or f.name,
        "level": getattr(f, 'level', 1),
        "isOnline": True,
        "avatarUrl": f.avatar_url or ""
    } for f in user.friends]
    
    return jsonify({"friends": friends_data}), 200

@app.route("/api/friends/add", methods=["POST"])
@jwt_required()
def add_friend():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    data = request.get_json()
    friend_name = data.get("username", "").strip()
    
    target_user = User.query.filter((User.username == friend_name) | (User.name == friend_name)).first()
    
    if not target_user:
        return jsonify({"error": "User doesn't exist"}), 404
    if target_user.id == user.id:
        return jsonify({"error": "You cannot add yourself"}), 400
    if target_user in user.friends:
        return jsonify({"error": "Already your friend"}), 400
        
    user.friends.append(target_user)
    target_user.friends.append(user)
    db.session.commit()
    
    return jsonify({"message": f"{target_user.username or target_user.name} added successfully!"}), 201

@app.route("/api/friends/remove/<int:friend_id>", methods=["DELETE"])
@jwt_required()
def remove_friend_api(friend_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    target_user = User.query.get(friend_id)
    
    if target_user in user.friends:
        user.friends.remove(target_user)
    if user in target_user.friends:
        target_user.friends.remove(user)
    db.session.commit()
    
    return jsonify({"message": "Friend removed"}), 200

@app.route("/api/chat/<int:friend_id>", methods=["GET"])
@jwt_required()
def get_chat_history(friend_id):
    current_user_id = int(get_jwt_identity())
    
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == friend_id)) |
        ((Message.sender_id == friend_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.created_at.asc()).all()
    
    return jsonify({"messages": [m.to_dict() for m in messages]}), 200

@app.route("/api/chat/send", methods=["POST"])
@jwt_required()
def send_chat_message():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    receiver_id = data.get("receiver_id")
    text = data.get("text", "").strip()
    
    if not text:
        return jsonify({"error": "Message cannot be empty"}), 400
        
    new_msg = Message(sender_id=current_user_id, receiver_id=receiver_id, text=text)
    db.session.add(new_msg)
    db.session.commit()
    
    return jsonify({"message": "Sent successfully", "data": new_msg.to_dict()}), 201


@app.route("/api/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard():
    try:
        users = User.query.order_by(User.level.desc(), User.current_xp.desc()).limit(10).all()
        
        leaderboard_data = [{
            "id": u.id,
            "name": u.username or u.name or "User",
            "level": getattr(u, 'level', 1),
            "currentXP": getattr(u, 'current_xp', 0),
            "coins": getattr(u, 'coins', 100),
            "streakDays": getattr(u, 'streak_days', 0),
            "avatarUrl": u.avatar_url or ""  
        } for u in users]
        
        return jsonify({"leaderboard": leaderboard_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/kick-player", methods=["POST"])
@jwt_required()
def kick_player():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    room_code = data.get("room_code")
    player_id_to_kick = data.get("player_id")

    room = Room.query.filter_by(room_code=room_code).first()
    if not room:
        return jsonify({"error": "Room not found"}), 404

    # Ensure only the host can kick players
    if room.host_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    # Remove the player from the in-memory active session list
    if room_code in ACTIVE_ROOM_SESSIONS:
        ACTIVE_ROOM_SESSIONS[room_code] = [
            p for p in ACTIVE_ROOM_SESSIONS[room_code] if str(p['id']) != str(player_id_to_kick)
        ]
        room.players = len(ACTIVE_ROOM_SESSIONS[room_code])
        db.session.commit()

    return jsonify({"message": "Player kicked successfully!"}), 200  

@app.route('/api/room-timer', methods=['GET'])
@jwt_required()
def get_room_timer():
    room_code = request.args.get('room_code')
    if not room_code:
        return jsonify({"error": "Room code required"}), 400
    
    timer_data = ACTIVE_ROOM_TIMERS.get(room_code, {"isRunning": False, "timeLeft": 25 * 60})
    return jsonify(timer_data), 200

@app.route('/api/room-timer', methods=['POST'])
@jwt_required()
def update_room_timer():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    room_code = data.get("room_code")
    is_running = data.get("isRunning")
    time_left = data.get("timeLeft")
    
    room = Room.query.filter_by(room_code=room_code).first()
    if not room:
        return jsonify({"error": "Room not found"}), 404
        
    # Only the host can update the timer
    if room.host_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403
        
    ACTIVE_ROOM_TIMERS[room_code] = {
        "isRunning": is_running,
        "timeLeft": time_left,
        "timestamp": os.urandom(4).hex()
    }
    
    return jsonify({"message": "Timer updated successfully!"}), 200  

# ========================================== #
# MERGED SESSION COMPLETION ROUTE            #
# ========================================== #
@app.route('/finish-session', methods=['POST'])
@jwt_required()
def finish_session():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    duration_mins = data.get("duration_mins", 90) # Default 1hr 30m
    completed_tasks = data.get("completed_tasks", 4)
    total_tasks = data.get("total_tasks", 4)
    pre_test = data.get("pre_test", 72)
    post_test = data.get("post_test", 84)
    
    # 1. Calculate Improvement
    improvement = post_test - pre_test

    # 2. WSM / Formula for XP and Coins Distribution
    task_xp = completed_tasks * 10       
    task_coins = completed_tasks * 5     
    completion_xp = 5                    
    completion_coins = 5                 

    hrs = duration_mins / 60
    if hrs >= 3:
        time_xp, time_coins = 20, 20
    elif hrs >= 2:
        time_xp, time_coins = 15, 15
    elif hrs >= 1:
        time_xp, time_coins = 10, 10
    else:
        time_xp, time_coins = 5, 5

    raw_xp = task_xp + completion_xp + time_xp
    raw_coins = task_coins + completion_coins + time_coins

    # 3. Streak Multiplier Boost
    user.streak_days = getattr(user, 'streak_days', 0) + 1
    streak_days = getattr(user, 'streak_days', 7)
    
    multiplier = 1.0
    if streak_days >= 100: multiplier = 3.0
    elif streak_days >= 80: multiplier = 2.5
    elif streak_days >= 30: multiplier = 2.0
    elif streak_days >= 21: multiplier = 1.75
    elif streak_days >= 14: multiplier = 1.5
    elif streak_days >= 7: multiplier = 1.25
    elif streak_days >= 3: multiplier = 1.1

    final_xp = round(raw_xp * multiplier)
    final_coins = raw_coins

    # 4. Update user stats in the database
    user.xp = getattr(user, 'xp', 0) + final_xp
    user.coins = getattr(user, 'coins', 0) + final_coins

    # 5. Check and Award Badges
    if user.streak_days == 7:
        award_badge(user.id, "media/badge2.png")
    if getattr(user, 'friends_count', 0) == 1:
        award_badge(user.id, "media/badge3.png")

    db.session.commit() 

    return jsonify({
        "success": True,
        "message": "Session complete!",
        "durationText": f"{duration_mins // 60}hr {duration_mins % 60}m",
        "tasksText": f"{completed_tasks}/{total_tasks}",
        "preTest": pre_test,
        "postTest": post_test,
        "improvement": improvement,
        "groupAvgScore": 85,
        "newLevel": getattr(user, 'level', 10),
        "xpEarned": final_xp,
        "coinsEarned": final_coins
    }), 200    


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