'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data for each account, containing account owner, transaction history, interest rate, and PIN
const account1 = {
  owner: 'Jonas Schmedtman',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// Array containing all account objects
const accounts = [account1, account2, account3, account4];

// UI Elements - Selecting various elements from the DOM
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// Buttons for various actions in the application
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Input fields for user interactions
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Map of currency abbreviations to full names
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const currenyFormatter = function (value, locale, currency) {
  const formattedNumbers = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: `${currency}`,
  }).format(value);

  return formattedNumbers;
};

// Example movements for testing purposes
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Function to create unique usernames for each account based on owner's name
const createUsername = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(acc => acc[0])
      .join('')
      .toUpperCase(); // E.g., "Jonas Schmedtman" => "JS"
  });
};

createUsername(accounts);

// Function to calculate and display the account balance and summaries
const calcBalance = function (account) {
  // Calculate total balance
  const balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  account.balance = balance;

  const formatBalance = currenyFormatter(
    balance,
    account.local,
    account.currency
  );

  // Calculate total deposits
  const sumIn = account.movements
    .filter(movements => movements >= 0)
    .reduce((acc, curr) => acc + curr, 0);

  const formatSumIn = currenyFormatter(sumIn, account.local, account.currency);

  // Calculate total withdrawals
  const sumOut = account.movements
    .filter(movements => movements < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const formatSumOut = currenyFormatter(
    sumOut,
    account.local,
    account.currency
  );

  // Calculate total interest earned (only on deposits > 1)
  const interestSum = account.movements
    .filter(movement => movement > 0)
    .map(movement => movement * (account.interestRate / 100))
    .filter(movement => movement >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  const formatInterest = currenyFormatter(
    interestSum,
    account.local,
    account.currency
  );

  // Update the UI with calculated values
  labelSumIn.textContent = formatSumIn;
  labelSumOut.textContent = formatSumOut;
  labelSumInterest.textContent = formatInterest;
  labelBalance.textContent = formatBalance;
};

// Function to update the UI with account details
const updateUI = function (account) {
  displayMovements(account);
  calcBalance(account);
};

// Function to display account movements (transactions) in the UI
const displayMovements = function (account) {
  containerMovements.innerHTML = ''; // Clear previous movements

  account.movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal'; // Determine type of movement

    const formattedNumbers = currenyFormatter(
      movement,
      account.locale,
      account.currency
    );

    const date = new Date(account.movementsDates.at(index));
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${month}/${day}/${year}`;

    const movementHTML = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedNumbers}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', movementHTML);
  });
};

let currentUser; // Variable to store the current logged-in user
let sort = 'asc'; // Sorting state

let timer;

const clearInputs = function () {
  inputLoginUsername.value = inputLoginPin.value = '';

  inputLoginPin.blur();
};
// Function to handle user login
const loginUser = function (e) {
  e.preventDefault(); // Prevent form submission

  const date = new Date();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Find the account matching the entered username and PIN
  currentUser = accounts.find(
    account =>
      String(inputLoginUsername.value) === account.username &&
      Number(inputLoginPin.value) === account.pin
  );

  if (!currentUser) return;

  const formattedDate = new Intl.DateTimeFormat(
    currentUser.locale,
    options
  ).format(date);

  labelDate.textContent = formattedDate;

  // Show the app and display a welcome message
  containerApp.style.opacity = '1';
  labelWelcome.textContent = `Welcome Back, ${
    currentUser.owner.split(' ')[0]
  }!`;

  // Clear input fields and remove focus
  clearInputs();

  if (timer) clearInterval(timer);

  timer = logOut();

  updateUI(currentUser);
};

// Function to handle transfers between accounts
const tranferFunc = function (e) {
  e.preventDefault();

  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (!(transferAccount || amount)) return;

  // Check if the transfer is valid
  if (
    amount > 0 &&
    currentUser.balance >= amount &&
    currentUser.username !== transferAccount.username
  ) {
    // Update movements for both accounts
    transferAccount.movements.push(amount);
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date());
    transferAccount.movementsDates.push(new Date());

    // Clear input fields
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    updateUI(currentUser);
  }
};

// Function to handle account closure
const closeAccountFunc = function (e) {
  e.preventDefault();
  console.log('click');

  const user = accounts.findIndex(
    account => account.username === currentUser.username
  );

  // Check if credentials match
  if (
    !(
      String(inputCloseUsername.value) === currentUser.username &&
      Number(inputClosePin.value) === currentUser.pin
    )
  )
    return;

  // Remove the account from the accounts array
  accounts.splice(user, 1);

  // Clear input fields and hide the app
  inputClosePin.value = inputCloseUsername.value = '';
  containerApp.style.opacity = 0;
};

// Function to handle loan requests
const requestLoanFunc = function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  // Check if the loan is valid (10% deposit rule)
  const hasDepositsMinimum = currentUser.movements.some(
    movement => movement >= amount * 0.1
  );

  inputLoanAmount.value = ''; // Clear input field

  if (!hasDepositsMinimum || amount < 0) return;

  // Add loan amount to movements
  currentUser.movements.push(amount);
  currentUser.movementsDates.push(new Date());
  updateUI(currentUser);
};

// Function to sort account movements
const sortMovements = function (e) {
  e.preventDefault();

  // Toggle sort state and update movements
  if (sort === 'asc') {
    currentUser.movements.sort((a, b) => a - b);
    sort = 'dsc';
    btnSort.innerHTML = `&uparrow; SORT`;
  } else if (sort === 'dsc') {
    currentUser.movements.sort((a, b) => b - a);
    sort = 'asc';
    btnSort.innerHTML = `&downarrow; SORT`;
  }

  updateUI(currentUser);
};

const logOut = function () {
  let time = 100;

  const countDown = 1000;

  const timeCount = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${secs}`;

    if (time === 0) {
      clearInterval(timer);

      clearInputs();

      containerApp.style.opacity = 0;

      labelWelcome.textContent = 'Log in to get started';
    }

    time--;
  };

  timeCount();

  const timer = setInterval(timeCount, countDown);

  return timer;
};

/////////////////////////////////////////////////
// Event listeners for various button actions
btnLogin.addEventListener('click', loginUser);
btnTransfer.addEventListener('click', tranferFunc);
btnClose.addEventListener('click', closeAccountFunc);
btnLoan.addEventListener('click', requestLoanFunc);
btnSort.addEventListener('click', sortMovements);
