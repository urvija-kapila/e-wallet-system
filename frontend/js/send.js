function sendMoney() {
    const receiver_id = document.getElementById("receiver").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const password = document.getElementById("password").value;

    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/transaction/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            receiver_id: parseInt(receiver_id),
            amount: amount,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            document.getElementById("message").innerText = data.message;
        } else {
            document.getElementById("message").innerText = data.error;
        }
    });
}

function goBack() {
    window.location.href = "dashboard.html";
}