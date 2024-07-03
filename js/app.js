let expensesArray = [];
let editItem = -1;

calculateTotal()

function updateDisplay() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expensesArray.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        let convertedTotal = item.valorConvertido * item.quant
        convertedTotal = Number(convertedTotal.toFixed(2));

        listItem.textContent = `${item.desc} (Qtd. ${item.quant}): ${item.valor} ${item.sourceCurrency} ==> ${convertedTotal} ${item.destCurrency}`;
        expensesList.appendChild(listItem);
    
        const editButton = document.createElement('img');
        editButton.className = 'button-item';
        editButton.src = "assets/edit-image.PNG";
        editButton.alt = "Editar";
        editButton.onclick = () => editExpense(index);
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('img');
        deleteButton.className = 'button-item';
        deleteButton.src = "assets/delete-image.PNG";
        deleteButton.alt = "Remover";
        deleteButton.onclick = () => deleteItem(index);
        listItem.appendChild(deleteButton);

        const lineBreak = document.createElement('br');
        expensesList.appendChild(lineBreak);
        expensesList.appendChild(lineBreak);
    });

    calculateTotal();
}

async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    const desc = document.getElementById('desc').value;
    const quant = document.getElementById('quant').value;
    const valor = document.getElementById('valor').value;
    const sourceCurrency = document.getElementById('sourceCurrency').value;
    const destCurrency = document.getElementById('destCurrency').value;
    
    let valorConvertido = await requestCurrencyData(sourceCurrency, destCurrency) * valor;
    valorConvertido = Number(valorConvertido.toFixed(2));

    if (editItem == -1){
        expensesArray.push({ desc, quant, valor, valorConvertido, sourceCurrency, destCurrency });
    }
    else {
        expensesArray[editItem].desc = desc;
        expensesArray[editItem].quant = quant;
        expensesArray[editItem].valor = valor;
        expensesArray[editItem].valorConvertido = valorConvertido;
        expensesArray[editItem].sourceCurrency = sourceCurrency;
        expensesArray[editItem].destCurrency = destCurrency;

        editItem = -1;
    }

    updateDisplay();
}

function editExpense(index) {
    editItem = index;

    document.getElementById('desc').value = expensesArray[index].desc
    document.getElementById('quant').value = expensesArray[index].quant
    document.getElementById('valor').value = expensesArray[index].valor
    document.getElementById('sourceCurrency').value = expensesArray[index].sourceCurrency
    document.getElementById('destCurrency').value = expensesArray[index].destCurrency
}

function deleteItem(index) {
    if (confirm(`Deseja deletar item de índice ${index}?`)) {
        expensesArray.splice(index, 1);
        updateDisplay();
    }
}

function calculateTotal() {    
    let sourceTotal = 0;
    let destTotal = 0;

    expensesArray.forEach((item, index) => {
        sourceTotal += item.quant * item.valor
        destTotal += item.quant * item.valorConvertido
    });

    destTotal = Number(destTotal.toFixed(2));

    // Drawing the total content
    const existingDiv = document.getElementById('totalDiv');
    if (!existingDiv) {
        const newDiv = document.createElement('div');
        newDiv.id = 'totalDiv';
        newDiv.innerHTML = `Total (Moeda de Origem): ${sourceTotal}<br>Total (Moeda de Destino): ${destTotal}`;
        document.body.appendChild(newDiv);
    }
    else {
        existingDiv.innerHTML = `Total (Moeda de Origem): ${sourceTotal}<br>Total (Moeda de Destino): ${destTotal}`;
        document.body.appendChild(existingDiv);
    }
}

async function requestCurrencyData(sourceCurrency, destCurrency) {
    convertedValue = await getData(sourceCurrency);

    return convertedValue.rates[destCurrency];
}

async function getData (sourceCurrency) {
    const apiBaseURL = "https://api.exchangerate-api.com/v4/latest/"
    
    try {
        const response = await fetch(apiBaseURL + sourceCurrency);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
