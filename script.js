'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];
let currentAccount;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// FUNCTION
const displayTransactions = function (transaction) {

  containerTransactions.innerHTML = '';

  transaction.forEach(function (trans, index) {
    let transType = trans > 0 ? 'deposit' : 'withdrawal';
    let transactionRow = `
    <div class="transactions__row">
    <div class="transactions__type transactions__type--${transType}">
      ${index + 1} ${transType}
    </div>
    <div class="transactions__value">${trans}$</div>
    </div>`;
    // <div class="transactions__date">2 дня назад</div>
    containerTransactions.insertAdjacentHTML('afterbegin', transactionRow);
  });
};

const createNickNames = function (accs) {
  accs.forEach(function (acc) {
    acc.nickName = acc.userName
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

const displayBalance = function (account) {
  const balance = account.trans.reduce((acc, amount) => acc + amount, 0);
  labelBalance.textContent = `${balance}$`;

  account.balance = Number(balance);

};

const displayTotals = function (acc) {

  const transactions = acc.transactions;
  const interest = acc.interest;

  const depositTotal = transactions
    .filter(trans => trans > 0)
    .reduce((acc, deposit) => acc += deposit, 0);
  labelSumIn.textContent = `${depositTotal}$`;

  const withdrawalTotal = transactions
    .filter(trans => trans < 0)
    .reduce((acc, withdrawal) => acc += withdrawal, 0);
  labelSumOut.textContent = `${withdrawalTotal}$`;

  const interestTotal = transactions
    .filter(depo => depo > 0)
    .map(depo => depo * interest / 100)
    .reduce((acc, interest) => acc += interest, 0);
  labelSumInterest.textContent = `${interestTotal.toFixed(2)}$`;

};

const updateUi = function (account) {

  displayTransactions(account.transactions);
  displayBalance(account);
  displayTotals(account);

};


// EVENTS
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.nickName === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    labelWelcome.textContent = `Рады, что вы снова с нами, ${currentAccount.userName.split(' ')[0]} !`

    containerApp.style.opacity = 100;

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUi(currentAccount);

  }
});

btnClose.addEventListener('click', function (e) {

  e.preventDefault();

  if (currentAccount.nickName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)) {

    const accIndex = accounts.findIndex(acc => acc.nickName === currentAccount.nickName);
    accounts.splice(accIndex, 1);

    labelWelcome.textContent = `Войдите в свой аккаунт`;
    containerApp.style.opacity = 0;
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});

btnTransfer.addEventListener('click', function (e) {

  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const recipientNickname = inputTransferTo.value;
  const recipient = accounts.find(acc => acc.nickName === recipientNickname && acc.nickName !== currentAccount.nickName);

  if (recipient
    && currentAccount.balance >= transferAmount
    && transferAmount > 0) {

    recipient.transactions.push(transferAmount);
    currentAccount.transactions.push(-transferAmount);
 
    inputTransferAmount.value = '';
    inputTransferTo.value = '';

    updateUi(currentAccount);
  }
});


// CALLS
createNickNames(accounts);

