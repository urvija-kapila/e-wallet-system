window.onload = function() {
    fetchBalance();
    fetchUser();
};

function fetchBalance() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/wallet/balance", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.balance !== undefined) {
            document.getElementById("balance").innerText = "₹ " + data.balance;
        } else {
            document.getElementById("balance").innerText = "Error fetching balance";
        }
    });
}

function fetchUser() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/auth/me", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("username").innerText = "Welcome, " + data.name;
        document.getElementById("nav-user").innerText = "Hi, " + data.name;
    });
}

function goToSend() {
    window.location.href = "send.html";
}

function goToHistory() {
    window.location.href = "history.html";
}

function showQR() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/auth/me", {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(data => {

        const payload = JSON.stringify({
            user_id: data.user_id,
            name: data.name
        });

        // clear old QR if exists
        document.getElementById("qrcode").innerHTML = "";

        new QRCode(document.getElementById("qrcode"), {
            text: payload,
            width: 200,
            height: 200
        });

        document.getElementById("qrBox").style.display = "block";
    });
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}
