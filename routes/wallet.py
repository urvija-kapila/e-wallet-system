from flask import Blueprint, request, jsonify
from utils.security import verify_token
from utils.db import mysql

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/balance', methods=['GET'])
def get_balance():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Token missing"}), 401

    user_id = verify_token(token)

    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT balance FROM wallets WHERE user_id=%s",
        (user_id,)
    )
    wallet = cur.fetchone()

    if not wallet:
        return jsonify({"error": "Wallet not found"}), 404

    return jsonify({"balance": float(wallet[0])})