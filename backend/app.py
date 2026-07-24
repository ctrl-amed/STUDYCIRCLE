from flask import Flask
from config import Config
from models import db
from models.user import User
from routes.auth import auth
from utils.security import bcrypt
from flask_cors import CORS
from utils.mail import mail

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "supportstudycircle@gmail.com"
app.config["MAIL_PASSWORD"] = "utpemiuldngtispu"
app.config["MAIL_DEFAULT_SENDER"] = "StudyCircle <supportstudycircle@gmail.com>>"

db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)
app.register_blueprint(auth)


@app.route("/")
def home():
    return "<h1>Welcome to StudyCircle!</h1><p>Backend is connected.</p>"


@app.route("/login")
def login():
    return "<h2>Login Page</h2>"


if __name__ == "__main__":
    with app.app_context():
        try:
            db.session.execute(db.text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL!")
        except Exception as e:
            print("❌ Database connection failed:")
            print(e)

    app.run(debug=True)