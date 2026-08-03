from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from config import Config
from models import db
from models.user import User
from routes.auth import auth
from utils.security import bcrypt
from utils.mail import mail

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




# ========================================== #
# SERVER EXECUTION                         #
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