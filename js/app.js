let expensesArray = [];
let editItem = -1;

function updateDisplay() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expensesArray.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        letConvertedTotal = item.valorConvertido * item.quant
        listItem.textContent = `${item.desc} (Qtd. ${item.quant}): ${item.valor} ${item.sourceCurrency} ==> ${letConvertedTotal} ${item.destCurrency}`;
        expensesList.appendChild(listItem);
    
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editExpense(index);
        expensesList.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(index);
        expensesList.appendChild(deleteButton);

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
        expensesArray[editItem].valorConvertido = 0;
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
    if (expensesArray.length > 0) {
        let sourceTotal = 0;
        let destTotal = 0;

        expensesArray.forEach((item, index) => {
            sourceTotal += item.quant * item.valor
            destTotal += item.quant * item.valorConvertido
        });

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
