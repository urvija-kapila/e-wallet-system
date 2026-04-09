from flask import Blueprint, request, jsonify
from utils.db import mysql
from utils.security import verify_token
from utils.security import check_password

transaction_bp = Blueprint('transaction', __name__)

@transaction_bp.route('/send', methods=['POST'])
def send_money():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Token missing"}), 401

    sender_id = verify_token(token)

    if not sender_id:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    receiver_id = data.get('receiver_id')
    amount = data.get('amount')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT password_hash FROM users WHERE user_id=%s", (sender_id,))
    user = cur.fetchone()

    if not user or not check_password(password, user[0].encode('utf-8')):
        return jsonify({"error": "Incorrect password"}), 401

    if not receiver_id or not amount:
        return jsonify({"error": "Missing fields"}), 400

    if amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400

    if amount > 50000:
        return jsonify({"error": "Suspicious transaction flagged"}), 403

    if sender_id == receiver_id:
        return jsonify({"error": "Cannot send money to yourself"}), 400


    try:
        mysql.connection.begin()

        # Check sender balance
        cur.execute("SELECT balance FROM wallets WHERE user_id=%s", (sender_id,))
        sender_wallet = cur.fetchone()

        if not sender_wallet or sender_wallet[0] < amount:
            return jsonify({"error": "Insufficient balance"}), 400

        # Check receiver exists
        cur.execute("SELECT balance FROM wallets WHERE user_id=%s", (receiver_id,))
        receiver_wallet = cur.fetchone()

        if not receiver_wallet:
            return jsonify({"error": "Receiver not found"}), 404

        # Deduct from sender
        cur.execute(
            "UPDATE wallets SET balance = balance - %s WHERE user_id=%s",
            (amount, sender_id)
        )

        # Add to receiver
        cur.execute(
            "UPDATE wallets SET balance = balance + %s WHERE user_id=%s",
            (amount, receiver_id)
        )

        # Record transaction
        cur.execute(
            """INSERT INTO transactions 
            (sender_id, receiver_id, amount, status) 
            VALUES (%s, %s, %s, %s)""",
            (sender_id, receiver_id, amount, "SUCCESS")
        )

        mysql.connection.commit()

        return jsonify({"message": "Transaction successful"})

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500

@transaction_bp.route('/history', methods=['GET'])
def transaction_history():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Token missing"}), 401

    user_id = verify_token(token)

    if not user_id:
        return jsonify({"error": "Invalid token"}), 401

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT transaction_id, sender_id, receiver_id, amount, status, created_at
        FROM transactions
        WHERE sender_id=%s OR receiver_id=%s
        ORDER BY created_at DESC
    """, (user_id, user_id))

    transactions = cur.fetchall()

    result = []

    for txn in transactions:
        result.append({
            "transaction_id": txn[0],
            "sender_id": txn[1],
            "receiver_id": txn[2],
            "amount": float(txn[3]),
            "status": txn[4],
            "timestamp": txn[5]
        })

    return jsonify(result)