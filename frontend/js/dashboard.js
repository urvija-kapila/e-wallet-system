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
    });
}

function goToSend() {
    window.location.href = "send.html";
}

function goToHistory() {
    window.location.href = "history.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}