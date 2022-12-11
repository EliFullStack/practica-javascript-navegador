//Variables y selectors
const formulario = document.querySelector('#formulario');
const conceptList = document.querySelector('#concepts ul');


//Events
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askForBudget);
    formulario.addEventListener('submit', addConcept)
}

//Classes
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.balance = Number(budget);
        this.income = Number(budget);
        this.output = 0;
        this.transactions = [];
    }

    newTransaction(transaction) {
        this.transactions = [...this.transactions, transaction];
        
        this.calculateBalance();
    }

    calculateBalance() {
        let totalOutput = 0;
        let totalIncome = 0;
        
        this.transactions.forEach(function (transaction) {
            if(transaction.amount < 0) {
                totalOutput += transaction.amount;
                return;
            } else {
                totalIncome += transaction.amount;
                return;
            }
            
        });

        this.balance = this.budget + totalOutput + totalIncome;
        this.output = totalOutput;
        this.income = this.budget + totalIncome;
        
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
        this.calculateBalance();
    }
            
    
        
    
}

class UI {
    addBudget (amount) {
        const {budget, balance} = amount;
        
        document.querySelector('#income').textContent = budget;  
        document.querySelector('#balance').textContent = balance;
        document.querySelector('#output').textContent = 0;
    }

    showAlert (message, type) {
        
        const divAlert = document.createElement('div');
        divAlert.classList.add('text-center');

        if(type === 'error') {
            divAlert.classList.add('bg-red-100', 'rounded-lg', 'py-5', 'px-6', 'mb-4', 'text-base', 'text-red-700', 'mb-3');
        } else {
            divAlert.classList.add('bg-green-100', 'rounded-lg', 'py-5', 'px-6', 'mb-4', 'text-base', 'text-green-700', 'mb-3');
        }
        
        divAlert.textContent = message;
        
        document.querySelector('.primario').insertBefore(divAlert, formulario);

        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }

    showTransactions (transactions) {

        this.cleanHtml();

        transactions.forEach(transaction => {
            const {concept, amount, id} = transaction;
            
            const newTransaction = document.createElement('li');
            newTransaction.className = 'flex justify-between px-6 py-2 border-b border-gray-200 w-full rounded-t-lg';
            newTransaction.setAttribute('data-id', id);

            newTransaction.innerHTML = `${concept} <span class="text-center text-base font-normal">${amount} € </span>`;
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'px-4 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'
            btnDelete.innerHTML = '&times';
            btnDelete.onclick = () => {
                deleteTransaction(id);
            }
            newTransaction.appendChild(btnDelete);
            
            conceptList.appendChild(newTransaction);
        });
    }

    cleanHtml() {
        while (conceptList.firstChild) {
            conceptList.removeChild(conceptList.firstChild);
        }
    }

    updateBalance(balance) {
        document.querySelector('#balance').textContent = balance;
    }

    updateOutput(output) {
        document.querySelector('#output').textContent = output;
    }

    updateIncome(income) {
        document.querySelector('#income').textContent = income;
    }

    
}

const ui = new UI();

let budget;
//Functions
function askForBudget() {
    const yourBudget = prompt('¿Cuál es tu presupuesto?');
    
    if (yourBudget === '' || yourBudget === null || isNaN(yourBudget) || yourBudget <= 0) {
        window.location.reload();
    }

    budget = new Budget(yourBudget);
    console.log(budget);
    ui.addBudget(budget);
}

function addConcept(event) {
    event.preventDefault();

    const concept = document.querySelector('#concept').value;
    const amount = Number(document.querySelector('#amount').value);

    //Validation
    if (concept === '' || amount === '') {
        ui.showAlert('Ambos campos son obligatorios.', 'error');
        return;
    } else if (isNaN(amount)) {
        ui.showAlert('Ups! Debes introducir una cantidad', 'error');
        return;
    }

    const transaction = {concept, amount, id: Date.now()};

    budget.newTransaction(transaction);
   
    ui.showAlert('Genial! Has agregado una transacción.');

    const {transactions, balance, output, income} = budget;
    ui.showTransactions(transactions);
    ui.updateBalance(balance);
    ui.updateOutput(output);
    ui.updateIncome(income);
    
    formulario.reset();
    
}

function deleteTransaction(id) {
    budget.deleteTransaction(id);
    const {transactions, balance, output, income} = budget;
    ui.showTransactions(transactions);
    ui.updateBalance(balance);
    ui.updateIncome(income);
    ui.updateOutput(output);
}