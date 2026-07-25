from flask import Flask
from config import Config
from models import db
from models.user import User
from routes.auth import auth
from utils.security import bcrypt
from flask_cors import CORS
from utils.mail import mail
from flask_jwt_extended import JWTManager

app = Flask(__name__)

from flask_cors import CORS

app = Flask(__name__)
# This allows all origins and handles the preflight automatically
CORS(app, supports_credentials=True)
# Tell CORS to allow cross-origin requests and the Authorization header
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = "studycircle_secret_key_2026"

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "supportstudycircle@gmail.com"
app.config["MAIL_PASSWORD"] = "utpemiuldngtispu"
app.config["MAIL_DEFAULT_SENDER"] = "StudyCircle <supportstudycircle@gmail.com>>"

db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(auth)


@app.route("/")
def home():
    return "<h1>Welcome to StudyCircle!</h1><p>Backend is connected.</p>"


@app.route("/login")
def login():
    return "<h2>Login Page</h2>"

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User # Make sure this matches how you import your models!

@app.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    # 1. Get the identity (usually the email or ID) from the secure JWT token
    current_user_identity = get_jwt_identity()
    
    # 2. Query your actual database for this specific user
    # (If your token stores the email, use email=current_user_identity. 
    #  If it stores the ID, use id=current_user_identity)
    user = User.query.filter_by(id=int(current_user_identity)).first()
    
    # 3. Security check: If the user doesn't exist in the database, return an error
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # 4. Use the custom method we added to user.py to send the real data!
    return jsonify(user.to_dict()), 200

if __name__ == "__main__":
    with app.app_context():
        try:
            db.session.execute(db.text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL!")
        except Exception as e:
            print("❌ Database connection failed:")
            print(e)

    app.run(debug=True)