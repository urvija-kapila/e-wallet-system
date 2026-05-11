let receiverId = null;
function confirmPayment() {
    const password = document.getElementById("confirmPassword").value;
    const token = localStorage.getItem("token");

    if (!receiverId) {
        alert("Please find a valid user first");
        return;
    }

    const btn = document.querySelector(".modal-actions button");
    btn.innerText = "Processing...";
    btn.disabled = true;

    fetch("http://127.0.0.1:5000/transaction/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            receiver_id: receiverId,
            amount: parseFloat(tempAmount),
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        btn.innerText = "Confirm";
        btn.disabled = false;

        if (data.message) {
            showSuccess();
        } else {
            alert(data.error);
        }
    });
}

let tempAmount = null;

function proceedPayment() {

    if (!receiverId) {
        alert("Please select a valid user");
        return;
    }

    const amount = document.getElementById("amount").value;

    if (!receiverId || !amount) {
        alert("Please fill all fields");
        return;
    }

    tempReceiver = receiverId;
    tempAmount = amount;

    document.getElementById("confirmText").innerText =
        `Send ₹${amount} to User ${receiverId}?`;

    document.getElementById("paymentModal").style.display = "flex";
}

function showSuccess() {
    document.getElementById("paymentModal").style.display = "none";

    document.getElementById("successText").innerText =
        `₹${tempAmount} sent successfully`;

    document.getElementById("successBox").style.display = "block";
}

function goToDashboard() {
    window.location.href = "dashboard.html";
}


function fetchUser() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/auth/me", {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("nav-user").innerText = "Hi, " + data.name;
    });
}

function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
}

function goBack() {
    window.location.href = "dashboard.html";
}


function findUser() {

    const emailInput = document.getElementById("email");

    if (emailInput.disabled) {
        alert("Email input is disabled (QR already used)");
        return;
    }

    const email = emailInput.value.trim();

    if (!email) {
        alert("Please enter an email");
        return;
    }

    fetch("http://127.0.0.1:5000/auth/get-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {
        console.log("API RESPONSE:", data);  

        if (data.user_id) {
            receiverId = data.user_id;

            console.log("SET receiverId:", receiverId);

            document.getElementById("receiverName").innerText = data.name;
            document.getElementById("receiverBox").style.display = "flex";

            document.getElementById("qrInput").disabled = true;
            document.querySelector("button[onclick='scanQR()']").disabled = true;
            document.getElementById("qrSection").style.display = "none";

        } else {
            console.log("ERROR:", data.error); 
            alert(data.error);
        }
    });
}

function scanQR() {
    const fileInput = document.getElementById("qrInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a QR image");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                console.log("QR RAW:", code.data);
                try {
                    const data = JSON.parse(code.data);
                    console.log("QR PARSED:", data);

                    // 🔥 THIS connects QR → your payment flow
                    receiverId = parseInt(data.user_id);

                    document.getElementById("receiverName").innerText = data.name;
                    document.getElementById("receiverBox").style.display = "flex";

                    // disable email input after QR scan
                    document.getElementById("email").disabled = true;
                    document.getElementById("emailSection").style.display = "none";


                } catch (e) {
                    alert("Invalid QR format");
                }
            } else {
                alert("QR not detected");
            }
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

fetchUser();