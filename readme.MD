# E-Wallet System 💳

A secure and user-friendly web-based E-Wallet application developed using Flask, MySQL, HTML, CSS, and JavaScript. The system allows users to register, securely log in, manage wallet balances, transfer money, view transaction history, and perform QR-based payments.

---

# 🚀 Features

## 🔐 Authentication & Security
- User Registration and Login
- Strong Password Validation
- Password Hashing using bcrypt
- JWT-based Authentication
- Secure Transaction Verification

---

## 💰 Wallet Functionalities
- Wallet Balance Management
- Send Money to Other Users
- Transaction History Tracking
- Real-time Balance Updates

---

## 📱 QR Payment Integration
- Generate Personal QR Code
- Scan QR via Image Upload
- Auto-fill Recipient Details
- Faster and Error-free Transactions

---

## 🎨 User Interface
- Modern and Responsive UI
- Dashboard with Quick Actions
- Payment Confirmation Modal
- Success Notifications and Toast Messages

---

# 🛠️ Tech Stack

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Python
- Flask

## Database
- MySQL

## Libraries & Tools
- bcrypt
- PyJWT
- QRCode.js
- jsQR

---

# 📂 Project Structure

```text
E-Wallet-System/
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── history.js
│   │   ├── register.js
│   │   └── send.js
│   │
│   ├── dashboard.html
│   ├── history.html
│   ├── index.html
│   ├── register.html
│   └── send.html
│
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   ├── transaction.py
│   └── wallet.py
│
├── utils/
│   ├── __init__.py
│   ├── db.py
│   └── security.py
│
├── app.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
```

---

## 2️⃣ Open Project Folder

```bash
cd E-Wallet-System
```

---

## 3️⃣ Install Dependencies

```bash
pip install flask flask-mysqldb bcrypt pyjwt flask-cors
```

---

## 4️⃣ Configure MySQL Database

- Create a MySQL database
- Import the SQL schema from `database/schema.sql`
- Update database credentials in `app.py`

---

## 5️⃣ Run the Flask Server

```bash
python app.py
```

---

## 6️⃣ Open the Application

Open in browser:

```text
http://127.0.0.1:5500/frontend/index.html
```

---

# 📊 Modules Implemented

- Authentication Module
- Wallet Management Module
- Transaction Module
- QR Generation Module
- QR Scanning Module

---

# 🔒 Security Features

- Passwords stored in hashed format using bcrypt
- JWT-based authentication
- Backend transaction validation
- Strong password policy enforcement
- Secure API communication

---

# 📱 QR Payment Workflow

1. User generates personal QR code
2. QR stores user details securely
3. Another user uploads/scans QR image
4. Receiver details are auto-filled
5. Payment is processed securely

---

# 📌 Future Enhancements

- Mobile Application
- Real Payment Gateway Integration
- OTP Verification
- AI-based Fraud Detection
- Cloud Deployment

---


# 📄 License

This project is developed for educational and academic purposes.