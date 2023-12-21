'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
  transactionsDates: [
    '2023-12-20T14:43:31.074Z',
    '2023-12-19T11:24:19.761Z',
    '2023-12-17T10:45:23.907Z',
    '2021-01-22T12:17:46.255Z',
    '2021-02-12T15:14:06.486Z',
    '2021-03-09T11:42:26.371Z',
    '2021-05-21T07:43:59.331Z',
    '2021-06-22T15:21:20.814Z',
  ],
  currency: 'USD',
  locale: 'ru-RU',
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
  transactionsDates: [
    '2020-10-02T14:43:31.074Z',
    '2020-10-29T11:24:19.761Z',
    '2020-11-15T10:45:23.907Z',
    '2021-01-22T12:17:46.255Z',
    '2021-02-12T15:14:06.486Z',
    '2021-03-09T11:42:26.371Z',
    '2021-05-21T07:43:59.331Z',
    '2021-06-22T15:21:20.814Z',
  ],
  currency: 'UAH',
  locale: 'uk-UA',
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
  transactionsDates: [
    '2020-10-02T14:43:31.074Z',
    '2020-10-29T11:24:19.761Z',
    '2020-11-15T10:45:23.907Z',
    '2021-01-22T12:17:46.255Z',
    '2021-02-12T15:14:06.486Z',
    '2021-03-09T11:42:26.371Z',
    '2021-05-21T07:43:59.331Z',
    '2021-06-22T15:21:20.814Z',
  ],
  currency: 'RUB',
  locale: 'ru-RU',
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
  transactionsDates: [
    '2020-10-02T14:43:31.074Z',
    '2020-10-29T11:24:19.761Z',
    '2020-11-15T10:45:23.907Z',
    '2021-01-22T12:17:46.255Z',
    '2021-02-12T15:14:06.486Z',
  ],
  currency: 'EUR',
  locale: 'fr-CA',
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
  transactionsDates: [
    '2020-10-02T14:43:31.074Z',
    '2020-10-29T11:24:19.761Z',
    '2020-11-15T10:45:23.907Z',
    '2021-01-22T12:17:46.255Z',
    '2021-02-12T15:14:06.486Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4, account5];
let currentAccount;
let transactionsSorted = false;

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
const displayTransactions = function (account, sort = false) {

  containerTransactions.innerHTML = '';

  const transacs = sort ? account.transactions.slice().sort((x, y) => x - y) : account.transactions;

  transacs.forEach(function (trans, index) {
    let transType = trans > 0 ? 'deposit' : 'withdrawal';

    let transDate = getTransactionDate(new Date(account.transactionsDates[index]), account.locale);

    let transactionRow = `
    <div class="transactions__row">
    <div class="transactions__type transactions__type--${transType}">
      ${index + 1} ${transType}
    </div>
    <div class="transactions__date">${transDate}</div>
    <div class="transactions__value">${trans.toFixed(2)}$</div>
    </div>`;

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
  const balance = account.transactions.reduce((acc, amount) => acc + amount, 0);
  labelBalance.textContent = `${balance.toFixed(2)}$`;

  account.balance = +balance;

};

const displayTotals = function (acc) {

  const transactions = acc.transactions;
  const interest = acc.interest;

  const depositTotal = transactions
    .filter(trans => trans > 0)
    .reduce((acc, deposit) => acc += deposit, 0);
  labelSumIn.textContent = `${depositTotal.toFixed(2)}$`;

  const withdrawalTotal = transactions
    .filter(trans => trans < 0)
    .reduce((acc, withdrawal) => acc += withdrawal, 0);
  labelSumOut.textContent = `${withdrawalTotal.toFixed(2)}$`;

  const interestTotal = transactions
    .filter(depo => depo > 0)
    .map(depo => depo * interest / 100)
    .reduce((acc, interest) => acc += interest, 0);
  labelSumInterest.textContent = `${interestTotal.toFixed(2)}$`;

};

const updateUi = function (account) {

  displayTransactions(account);
  displayBalance(account);
  displayTotals(account);

};

const getFormatedDate = function (dateToFormat, locale, options = {}) {

  // const day = `${dateToFormat.getDate()}`.padStart(2, '0');
  // const month = `${dateToFormat.getMonth() + 1}`.padStart(2, '0');
  // const year = `${dateToFormat.getFullYear()}`;

  // return `${day}/${month}/${year}`;

  return Intl.DateTimeFormat(locale, options).format(dateToFormat);
};

const getTransactionDate = function (transactionDate, locale) {

  const getPassedDays = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 24 * 60 * 60));

  const daysPassed = getPassedDays(new Date(), transactionDate);

  if (daysPassed === 0) return `Сегодня`;

  if (daysPassed === 1) return `Вчера`;

  if (daysPassed <= 5) {
    return `${daysPassed} дня назад`
  } else {
    return getFormatedDate(transactionDate, locale);
  };

};


// EVENTS
btnLogin.addEventListener('click', function (e) {

  e.preventDefault();
  currentAccount = accounts.find(acc => acc.nickName === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {

    labelWelcome.textContent = `Рады, что вы снова с нами, ${currentAccount.userName.split(' ')[0]} !`

    containerApp.style.opacity = 100;

    const dateOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long',
    }

    labelDate.textContent = getFormatedDate(new Date(), currentAccount.locale, dateOptions);

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

  const transferAmount = +inputTransferAmount.value;
  const recipientNickname = inputTransferTo.value;
  const recipient = accounts.find(acc => acc.nickName === recipientNickname && acc.nickName !== currentAccount.nickName);

  if (recipient
    && currentAccount.balance >= transferAmount
    && transferAmount > 0) {

    recipient.transactions.push(transferAmount);
    currentAccount.transactions.push(-transferAmount);

    recipient.transactionsDates.push(new Date().toISOString());
    currentAccount.transactionsDates.push(new Date().toISOString());

    inputTransferAmount.value = '';
    inputTransferTo.value = '';

    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (loanAmount > 0 && currentAccount.transactions.some(trans => trans >= loanAmount * 10 / 100)) {
    currentAccount.transactions.push(loanAmount);
    currentAccount.transactionsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  }

  inputLoanAmount.value = '';

});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayTransactions(currentAccount, !transactionsSorted);
  transactionsSorted = !transactionsSorted;
});


// CALLS
createNickNames(accounts);

