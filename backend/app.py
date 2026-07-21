from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Welcome to StudyCircle!</h1><p>Backend is working successfully. 🚀</p>"

@app.route("/login")
def login():
    return "<h2>Login Page</h2>"

@app.route("/register")
def register():
    return "<h2>Register Page</h2>"

if __name__ == "__main__":
    app.run(debug=True)