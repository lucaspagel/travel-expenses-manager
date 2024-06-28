const container = document.querySelector(".container")

let expensesArray = [];


function updateDisplay() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expensesArray.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.textContent = `${item.desc} (Qtd. ${item.quant}): ${item.valor} XX${item.sourceCurrency} ==> YY ${item.destCurrency}`;
        expensesList.appendChild(listItem);
    });

    const lineBreak = document.createElement('br');
    expensesList.appendChild(lineBreak);
    expensesList.appendChild(lineBreak);
}


function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    const desc = document.getElementById('desc').value;
    const quant = document.getElementById('quant').value;
    const valor = document.getElementById('valor').value;
    const sourceCurrency = document.getElementById('sourceCurrency').value;
    const destCurrency = document.getElementById('destCurrency').value;

    expensesArray.push({desc, quant, valor, sourceCurrency, destCurrency});

    updateDisplay();
}
