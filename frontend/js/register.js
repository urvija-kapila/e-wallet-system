// Password strength checker (live feedback)
document.getElementById("password").addEventListener("input", function () {
    const password = this.value;
    const msg = document.getElementById("password-msg");
    const hint = document.getElementById("passwordHint");

    const strongPassword =
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);

    if (!password) {
        // Show hint, clear error
        hint.style.display = "block";
        msg.innerText = "";
    } 
    else if (strongPassword) {
        // Hide hint, show success
        hint.style.display = "none";
        msg.innerText = "Strong password ✅";
        msg.style.color = "green";
    } 
    else {
        // Hide hint, show error
        hint.style.display = "none";
        msg.innerText = "Weak password ❌";
        msg.style.color = "red";
    }
});


// REGISTER FUNCTION
function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const msg = document.getElementById("register-msg");

    // Basic validation
    if (!name || !email || !password) {
        msg.innerText = "All fields are required";
        msg.style.color = "red";
        return;
    }

    // Password strength check again before sending
    const strongPassword =
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);

    if (!strongPassword) {
        msg.innerText = "Password is too weak";
        msg.style.color = "red";
        return;
    }

    // API CALL
    fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            showToast("Registered successfully 🎉", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } else {
            showToast(data.error || "Registration failed", "error");
        }
    })
    .catch(err => {
        console.log(err);
        showToast("Something went wrong", "error");
    });
}

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}