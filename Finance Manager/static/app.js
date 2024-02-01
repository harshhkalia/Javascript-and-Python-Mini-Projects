document.addEventListener('DOMContentLoaded', function () {
    loadTransactions();
    loadBudgets();
    loadGoals();
});

// Transactions

function addTransaction() {
    const accountType = document.getElementById('accountType').value;
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const notes = document.getElementById('notes').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    if (!isNaN(amount)) {
        const transaction = { account_type: accountType, type, amount, notes, category, tags };
        saveTransaction(transaction);
        loadTransactions();
        loadBudgets();  
        loadGoals();  
    }
}

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const selectedAccount = document.getElementById('accountFilter').value;
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        if(selectedAccount === 'aggregate' || transaction.account_type === selectedAccount){
        const li = document.createElement('li');
        const tags = transaction.tags.length > 0 ? `, <strong>Tags:</strong> ${transaction.tags.join(', ')}` : '';
        li.innerHTML = `
            <div class="transaction-details">
                <strong>Type:</strong> ${transaction.type}, 
                <strong>Amount:</strong> ${transaction.amount}, 
                <strong>Notes:</strong> ${transaction.notes}, 
                <strong>Category:</strong> ${transaction.category || 'Not specified'}${tags}
            </div>
            <button onclick="removeTransaction(${index})">Remove</button>
        `;
        transactionList.appendChild(li);
        }
    });
}

function removeTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    if (index >= 0 && index < transactions.length) {
        const removedTransaction = transactions.splice(index, 1)[0];
        localStorage.setItem('transactions', JSON.stringify(transactions));
        loadTransactions();
        loadBudgets();
        loadGoals(); 
        console.log('Transaction removed:', removedTransaction);
    }
}

function clearAllTransactions() {
    const selectedAccount = document.getElementById('accountFilter').value;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions = transactions.filter(transaction => transaction.account_type !== selectedAccount);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
    loadBudgets();  
    loadGoals();  
    console.log('All transactions cleared for selected account:', selectedAccount);
}

// Budgets

function addBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (category && !isNaN(amount)) {
        const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        budgets[category] = amount;
        localStorage.setItem('budgets', JSON.stringify(budgets));
        loadBudgets();
    }
}

function updateBudget(operation) {
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (category && !isNaN(amount)) {
        const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        if (operation === 'add') {
            budgets[category] = (budgets[category] || 0) + amount;
        } else if (operation === 'subtract') {
            if (budgets[category] >= amount) {
                budgets[category] -= amount;
            } else {
                console.error('Cannot subtract more than the existing budget!');
            }
        }
        localStorage.setItem('budgets', JSON.stringify(budgets));
        loadBudgets();
    }
}

function removeBudget() {
    const category = document.getElementById('budgetCategory').value;

    if (category) {
        const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        delete budgets[category];
        localStorage.setItem('budgets', JSON.stringify(budgets));
        loadBudgets();
    }
}

function loadBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {};
    const budgetList = document.getElementById('budgetList');
    budgetList.innerHTML = '';

    for (const category in budgets) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${category} Budget:</strong> $${budgets[category].toFixed(2)}`;
        budgetList.appendChild(li);
    }
}

// Financial Goals

function addGoal() {
    const goalName = document.getElementById('goalName').value;
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const targetDate = document.getElementById('targetDate').value;

    if (!goalName || isNaN(targetAmount) || !targetDate) {
        alert('Please fill in all goal details.');
        return;
    }

    const goal = { name: goalName, targetAmount, targetDate, progress: 0 };
    saveGoal(goal);
    loadGoals();

    document.getElementById('goalName').value = '';
    document.getElementById('targetAmount').value = '';
    document.getElementById('targetDate').value = '';
}

function saveGoal(goal) {
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
}

function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalList = document.getElementById('goalList');
    goalList.innerHTML = '';

    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        const targetAmount = goal.targetAmount ? `$${goal.targetAmount.toFixed(2)}` : 'Not specified';
        const progress = goal.progress ? `$${goal.progress.toFixed(2)}` : 'Not specified';
        li.innerHTML = `
            <div>
                <strong>Goal:</strong> ${goal.name}, 
                <strong>Target Amount:</strong> ${targetAmount}, 
                <strong>Target Date:</strong> ${goal.targetDate},
                <strong>Progress:</strong> ${progress} out of ${targetAmount}
            </div>
            <button onclick="removeGoal(${index})">Remove Goal</button>
        `;
        goalList.appendChild(li);
    });
}

function removeGoal(index) {
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    if (index >= 0 && index < goals.length) {
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals();
    }
}

function updateGoalProgress(transactions) {
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.forEach(goal => {
        const goalTransactions = transactions.filter(transaction => transaction.category === goal.name);
        goal.progress = goalTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    });
    localStorage.setItem('goals', JSON.stringify(goals));
    loadGoals();
}

function handleNewTransactions() {
    const transactions = loadTransactions();
    updateGoalProgress(transactions);
}

function openGoalsPanel(){
    document.getElementById('goalsPanel').style.right = '0';
}

function closeGoalsPanel(){
    document.getElementById('goalsPanel').style.right = '-100%';
}

function applyFilters(){
    const searchKeyword = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('filterCategory').value.toLowerCase();

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filteredTransaction = transactions.filter(transaction =>{
        const matchSearch = transaction.notes.toLowerCase().includes(searchKeyword) ||
                            transaction.category.toLowerCase().includes(searchKeyword) ||
                            transaction.tags.some(tag => tag.toLowerCase().includes(searchKeyword));

        const matchCategory = selectedCategory === ''|| transaction.category.toLowerCase() === selectedCategory;

        return matchCategory && matchSearch
    });
    
    displayFilteredTransactions(filteredTransaction);
}

function displayFilteredTransactions(transactions){
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) =>{
        const li = document.createElement('li');
        const tags = transaction.tags.length > 0 ? `, <strong>Tags:</strong> ${transaction.tags.join(',')}`:'';
        li.innerHTML =`
        <div class ='transaction-details'>
        <strong>Type:</strong> ${transaction.type},
        <strong>Amount:</strong> ${transaction.amount},
        <strong>Notes:</strong> ${transaction.notes},
        <strong>Category:</strong> ${transaction.category || 'Not specified'} ${tags},
        </div>
        <button onclick ='removeTransaction(${index})'>Remove</button>
        `
        transactionList.appendChild(li);
    })
}

function searchTransactions(){
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const searchResults = transactions.filter(transaction =>{
        const notesMatch = transaction.notes.toLowerCase().includes(searchInput);
        const categoryMatch = transaction.category.toLowerCase().includes(searchInput);
        const tagsMatch = transaction.tags.some(tag => tag.toLowerCase().includes(searchInput));
        return notesMatch || categoryMatch || tagsMatch;
    });

    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    const resultContainer = document.getElementById('searchResultsContainer');
    resultContainer.innerHTML = '';

    if (results.length === 0) {
        resultContainer.innerHTML = '<p>No result found.</p>';
    } else {
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.innerHTML = `
                <p><strong>Type:</strong> ${result.type},
                <strong>Notes:</strong> ${result.notes},
                <strong>Amount:</strong> ${result.amount},
                <strong>Category:</strong> ${result.category || 'Not specified' }</p>
            `;
            resultElement.addEventListener('click', () => {
                // Trigger the event to handle the result click
                const event = new CustomEvent('resultClicked', { detail: result });
                document.dispatchEvent(event);
            });
            resultContainer.appendChild(resultElement);
        });
    }
}

document.addEventListener('resultClicked', function (event) {
    const clickedResult = event.detail;
    if (typeof loadTransactionsBySearch === 'function') {
        loadTransactionsBySearch(clickedResult);
    }
});

function scrollToTransactionArea(){
    const transactionArea = document.getElementById('transactionArea');
    if(transactionArea){
        transactionArea.scrollIntoView({behavior: 'smooth'});
    }
}

function loadTransactionsBySearch(searchResult) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const searchKeyword = searchResult.notes.toLowerCase();

    const searchResults = transactions.filter(transaction => {
        const notesMatch = transaction.notes.toLowerCase().includes(searchKeyword);
        const categoryMatch = transaction.category.toLowerCase().includes(searchKeyword);
        const tagsMatch = transaction.tags.some(tag => tag.toLowerCase().includes(searchKeyword));

        return notesMatch || categoryMatch || tagsMatch;
    });

    displaySearchResults(searchResults);
    scrollToTransactionArea();
}

function openTransactionsPanel(){
    document.getElementById('sidePanel').style.right = '0';
}

function closeTransactionsPanel(){
    document.getElementById('sidePanel').style.right = '-100%';
}

  const avatarContainer = document.getElementById('avatar');
  const userNameElement = document.getElementById('user-name');
  const userMobileElement = document.getElementById('user-mobile');

  function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
  }

  function showSignupForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
  }

  async function login(event) {
    event.preventDefault();
    const mobileNumber = document.getElementById('login-mobile').value;
    const password = document.getElementById('login-password').value;
  
    try {
      await firebase.auth().signInWithEmailAndPassword(`${mobileNumber}@gmail.com`, password);
      showPopUp('Login successful');
    } catch (error) {
      console.error('Login Failed', error);
      showPopUp('Login failed. Please try again');
    }
  }
  
  async function signup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const mobileNumber = document.getElementById('signup-mobile').value;
    const password = document.getElementById('signup-password').value;
  
    try {
      await firebase.auth().createUserWithEmailAndPassword(`${mobileNumber}@gmail.com`, password);
      const user = firebase.auth().currentUser;
      await user.updateProfile({ displayName: name });
      showPopUp('Signup successful');
    } catch (error) {
      console.error('Signup Failed', error);
      showPopUp('Signup failed. Please try again later');
    }
  }

  function handleAuthenticationResponse(user) {
    if (user) {
      userNameElement.textContent = user.displayName;
      userMobileElement.textContent = user.phoneNumber;
      loadAvatar(user.displayName); 
    } else {
        
    }
  }

function showPopUp(message){
    const popupBar = document.getElementById('popup-bar');
    const popupText = document.getElementById('popup-text');

    popupText.textContent = message;
    popupBar.classList.remove('hidden');

    setTimeout(() =>{
        popupBar.classList.add('hidden');
    }, 3000);
}