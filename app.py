from flask import Flask
from flask_cors import CORS
from utils.db import mysql
from routes.auth import auth_bp
from routes.wallet import wallet_bp
from routes.transaction import transaction_bp

app = Flask(__name__)
CORS(app)

# MySQL config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '28112005'
app.config['MYSQL_DB'] = 'ewallet'

mysql.init_app(app)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(wallet_bp, url_prefix='/wallet')
app.register_blueprint(transaction_bp, url_prefix='/transaction')

# Test route
@app.route('/test-db')
def test_db():
    cur = mysql.connection.cursor()
    cur.execute("SELECT 1")
    return "DB Connected!"

if __name__ == "__main__":
    app.run(debug=True)