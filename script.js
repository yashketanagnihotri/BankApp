"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//adding movements functions
const displayMovements = function (acc) {
  containerMovements.innerHTML = ""; //to remove all the elements
  const movements = acc.movements;
  movements.forEach(function (mov, i) {
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${
        mov > 0 ? "deposit" : "withdrawal"
      }">${i + 1} ${mov > 0 ? "Deposit" : "Withdrawl"}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html); //this adds a new html element
    // 'afterbegin' tells where the element has to be added
  });
};

//accountwise display of movements

//creating usernames
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //to make a new property for the object
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

//calculating the balance
const calBalance = function (accs) {
  accs.forEach(function (acc) {
    acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  });
};
calBalance(accounts);
//updating the element's value
const updateBalance = function (account) {
  labelBalance.textContent = "€ " + account.balance;
};

//displaying summary
const displaySummary = function (account) {
  const movements = account.movements;

  const income = movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val);
  labelSumIn.textContent = `€ ${income}`;

  const outgoing = movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `€ ${Math.abs(outgoing)}`;

  const interest = movements
    .filter((val) => val > 0)
    .map((val) => val * (account.interestRate / 100))
    .filter((val) => val >= 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = "€ " + interest.toFixed(2);
};

//implementing login and UI display
const greetings = ["Hello, ", "Have a great day!! ", "Hey! ", "Welcome Back,"];
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    let randNum = Math.floor(Math.random() * 4);
    containerApp.classList.add("app-visible");
    displayMovements(currentAccount);
    updateBalance(currentAccount);
    displaySummary(currentAccount);
    labelWelcome.textContent = `${greetings[randNum]} ${
      currentAccount.owner.split(" ")[0]
    }`;
  } else {
    alert("Username Or Password is invalid");
  }
  (inputLoginUsername.value = ""), (inputLoginPin.value = "");
  inputLoginPin.blur(); //this method removes the blinking cursor from there
});

//loan functionality
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanVal = inputLoanAmount.value;
  setTimeout(function () {
    if (currentAccount.movements.some((acc) => acc >= loanVal / 10)) {
      currentAccount.movements.push(Number(loanVal));
      currentAccount.balance += Number(loanVal);
      displayMovements(currentAccount);
      updateBalance(currentAccount);
      displaySummary(currentAccount);
      labelBalance.textContent = "€ " + currentAccount.balance;
      inputLoanAmount.value = "";
      document.querySelector(".loan_Request").textContent = "Request loan";
    } else {
      inputLoanAmount.value = "";
      document.querySelector(".loan_Request").textContent = "Request loan";
      alert("The Loan Request Has Failed!!");
    }
  }, 5000);
  document.querySelector(".loan_Request").textContent =
    "Your Loan Request Is Processing...";
});

//account transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAccount = accounts.find(
      (acc) =>
        acc.owner === inputTransferTo.value && acc.owner != currentAccount.owner
    ),
    transferAmount = Number(inputTransferAmount.value);
  if (!transferAccount) {
    alert("The account number entered is invalid");
    (inputTransferAmount.value = ""), (inputTransferTo.value = "");
  } else {
    setTimeout(function () {
      //removing money from the senders account
      //check if the person has the money or not
      if (currentAccount.balance < Number(transferAmount)) {
        alert("Transfer Request Failed!!!");
      } else {
        currentAccount.movements.push(-Number(transferAmount));
        currentAccount.balance -= Number(transferAmount);
        displayMovements(currentAccount);
        updateBalance(currentAccount);
        displaySummary(currentAccount);

        //adding money to the recievers account
        transferAccount.movements.push(Number(transferAmount));
        transferAccount.balance += Number(transferAmount);
        calBalance(accounts);
        updateBalance(currentAccount);
      }
      document.querySelector(".transfers-heading").textContent =
        "Transfer money";
      (inputTransferAmount.value = ""), (inputTransferTo.value = "");
    }, 5000);
    document.querySelector(".transfers-heading").textContent =
      "Your Transfer Is Processing...";
  }
});

//closing account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const userName = inputCloseUsername.value,
    pin = Number(inputClosePin.value);
  //findIndex method is used to find the element's index
  if (userName == currentAccount.username && pin == currentAccount.pin) {
    accounts.splice(
      accounts.findIndex((acc) => acc.username == currentAccount.username),
      1
    );
    inputCloseUsername.value = inputClosePin.value = "";
    alert("Your Account Has Been Deleted");
    containerApp.classList.remove("app-visible");
    labelWelcome.textContent = "Log in to get started";
  }
});
