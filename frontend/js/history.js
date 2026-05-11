window.onload = function () {
    loadHistory();
    fetchUser();
};

function loadHistory() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/transaction/history", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        const tableBody = document.getElementById("history-body");
        tableBody.innerHTML = "";

        data.forEach(txn => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${txn.transaction_id}</td>
                <td>${txn.sender_name}</td>
                <td>${txn.receiver_name}</td>
                <td class="amount">₹ ${txn.amount}</td>
                <td class="${txn.status === 'SUCCESS' ? 'status-success' : 'status-fail'}">
                    ${txn.status}
                </td>
                <td>${new Date(txn.timestamp).toLocaleString()}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(err => console.log(err));
}

function goBack() {
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

