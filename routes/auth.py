from flask import Blueprint, request, jsonify
from utils.db import mysql
from utils.security import hash_password
from utils.security import check_password, generate_token
from utils.security import verify_token


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed_pw = hash_password(password)

    cur = mysql.connection.cursor()

    # insert user
    cur.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (name, email, hashed_pw)
    )
    mysql.connection.commit()

    user_id = cur.lastrowid

    # create wallet
    cur.execute(
        "INSERT INTO wallets (user_id) VALUES (%s)",
        (user_id,)
    )
    mysql.connection.commit()

    return jsonify({"message": "User registered successfully"})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id, password_hash FROM users WHERE email=%s", (email,))
    user = cur.fetchone()

    if user and check_password(password, user[1].encode('utf-8')):
        token = generate_token(user[0])
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_user():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Token missing"}), 401

    user_id = verify_token(token)

    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    cur = mysql.connection.cursor()
    cur.execute("SELECT name FROM users WHERE user_id=%s", (user_id,))
    user = cur.fetchone()

    return jsonify({"name": user[0]})