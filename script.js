let type = document.querySelector("#type");
let category = document.querySelector("#category");
let amount = document.querySelector("#amount");
let btn = document.querySelector("#add-transaction-button");
let ul1 = document.querySelector("#transaction-list");
let ul2 = document.querySelector("#transaction-list2");
let balanceElement = document.querySelector("#current-balance");
let currentBalance = 0;

// Load stored transactions and balance
window.onload = () => {
    loadStoredData();
    displayBalance();
    displayStoredTransactions();
};

btn.addEventListener("click", logSelectedValue);

function logSelectedValue() {
    let selectedValue = type.options[type.selectedIndex].value;
    let li = document.createElement("LI");
    let t = document.createTextNode(selectedValue);
    let space1 = document.createTextNode(' : ');
    let t2 = document.createTextNode(category.value);
    let space2 = document.createTextNode(' : ');
    let t3 = document.createTextNode(amount.value);
    li.appendChild(t);
    li.appendChild(space1);
    li.appendChild(t2);
    li.appendChild(space2);
    li.appendChild(t3);

    if (selectedValue === "income") {
        ul1.appendChild(li);
        currentBalance += parseFloat(amount.value);
        updateChart(incomeChart, category.value, parseFloat(amount.value));
    } else if (selectedValue === "expense") {
        ul2.appendChild(li);
        currentBalance -= parseFloat(amount.value);
        updateChart(expenseChart, category.value, parseFloat(amount.value));
    }
    
    updateBalance();
    saveTransaction(selectedValue, category.value, amount.value);
    clearFields();
}

function updateBalance() {
    balanceElement.textContent = currentBalance.toFixed(2);
    localStorage.setItem("currentBalance", currentBalance.toFixed(2));
}

function clearFields() {
    category.value = '';
    amount.value = '';
}

function saveTransaction(type, category, amount) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push({ type, category, amount });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadStoredData() {
    const storedBalance = localStorage.getItem("currentBalance");
    if (storedBalance) {
        currentBalance = parseFloat(storedBalance);
    }

    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    storedTransactions.forEach(transaction => {
        let li = document.createElement("LI");
        let t = document.createTextNode(transaction.type);
        let space1 = document.createTextNode(' : ');
        let t2 = document.createTextNode(transaction.category);
        let space2 = document.createTextNode(' : ');
        let t3 = document.createTextNode(transaction.amount);
        li.appendChild(t);
        li.appendChild(space1);
        li.appendChild(t2);
        li.appendChild(space2);
        li.appendChild(t3);

        if (transaction.type === "income") {
            ul1.appendChild(li);
        } else if (transaction.type === "expense") {
            ul2.appendChild(li);
        }
        // Update chart for loaded transactions
        if (transaction.type === "income") {
            updateChart(incomeChart, transaction.category, parseFloat(transaction.amount));
        } else if (transaction.type === "expense") {
            updateChart(expenseChart, transaction.category, parseFloat(transaction.amount));
        }
    });
}

function displayBalance() {
    balanceElement.textContent = currentBalance.toFixed(2);
}

function displayStoredTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    storedTransactions.forEach(transaction => {
        let li = document.createElement("LI");
        let t = document.createTextNode(transaction.type);
        let space1 = document.createTextNode(' : ');
        let t2 = document.createTextNode(transaction.category);
        let space2 = document.createTextNode(' : ');
        let t3 = document.createTextNode(transaction.amount);
        li.appendChild(t);
        li.appendChild(space1);
        li.appendChild(t2);
        li.appendChild(space2);
        li.appendChild(t3);

        if (transaction.type === "income") {
            ul1.appendChild(li);
        } else if (transaction.type === "expense") {
            ul2.appendChild(li);
        }
    });
}

const incomeCtx = document.getElementById('incomeChart').getContext('2d');
const incomeChart = new Chart(incomeCtx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Income',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const expenseCtx = document.getElementById('expenseChart').getContext('2d');
const expenseChart = new Chart(expenseCtx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Expense',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart(chart, label, data) {
    const existingIndex = chart.data.labels.indexOf(label);
    if (existingIndex >= 0) {
        chart.data.datasets[0].data[existingIndex] += data;
    } else {
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(data);
    }
    chart.update();
}
    