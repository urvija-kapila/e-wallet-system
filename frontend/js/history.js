window.onload = function() {
    fetchHistory();
};

function fetchHistory() {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/transaction/history", {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("historyTable");
        table.innerHTML = "";

        data.forEach(txn => {
            const row = `
                <tr>
                    <td>${txn.transaction_id}</td>
                    <td>${txn.sender_id}</td>
                    <td>${txn.receiver_id}</td>
                    <td>₹ ${txn.amount}</td>
                    <td>${txn.status}</td>
                    <td>${txn.timestamp}</td>
                </tr>
            `;
            table.innerHTML += row;
        });
    });
}

function goBack() {
    window.location.href = "dashboard.html";
}