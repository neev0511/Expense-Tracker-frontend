const path = "https://expense-tracker-backend-1dzo.onrender.com/api/v1/";
const appendList = document.querySelector("#list");
let totalIncome = 0;
let totalExpense = 0;
let balance = 0;

function displayTransaction(t = true) {
  let incomes;
  let expenses;
  transactions = [];
  appendList.innerHTML = "";
  axios.get(path + "get-incomes").then((response) => {
    incomes = response.data;
    axios.get(path + "get-expenses").then((response) => {
      expenses = response.data;

      // Display Code here
      if (incomes.length === 0 && expenses.length === 0) {
        document.querySelector(".list").style.display = "none";
      } else {
        document.querySelector(".list").style.display = "block";
      }

      for (let transaction of expenses) {
        transactions.push(transaction);
        totalExpense += transaction["amount"];
      }
      for (let task of incomes) {
        transactions.push(task);
        totalIncome += task["amount"];
      }
      if (t === false) {
        console.log("flase");
        return transactions;
      }
      transactions.sort(sortByProperty("date")).reverse();
      sortAndDisplay(transactions);
    });
  });
  // Sorting Transactions here
}

function sortAndDisplay(transactions) {
  for (let task of transactions) {
    console.log(task);
    if (task["type"] === "income") {
      string = `
    <div class="sublist-content bordergreen">
    <button class="fa-solid fa-money-bill green edit"></button>
    <p class="product">${task["title"]}</p>
    <p class="amount green">${task["amount"]}</p>
    <button
      class="fa-solid fa-trash-can delete"
      id="income.....${task["_id"]}"
      onclick="deleteTransaction(this.id)"
    ></button>
  </div>
    `;
    } else {
      string = `
      <div class="sublist-content borderred">
      <button class="fa-solid fa-money-bill red edit"></button>
      <p class="product">${task["title"]}</p>
      <p class="amount red">${task["amount"]}</p>
      <button
        class="fa-solid fa-trash-can delete"
        id="expense.....${task["_id"]}"
        onclick="deleteTransaction(this.id)"
      ></button>
    </div>
      `;
    }
    appendList.innerHTML += string;
    balance = totalIncome - totalExpense;
    document.querySelector("#totalIncomeSpan").innerText = totalIncome;
    document.querySelector("#totalExpenseSpan").innerText = totalExpense;
    let b = document.querySelector("#TotalBalanceSpan");
    b.innerText = balance;
    if (balance < 0) {
      b.style.color = "rgb(254, 73, 73)";
    } else {
      b.style.color = "rgb(10, 186, 57)";
    }
  }
}

function deleteTransaction(id) {
  // DELETE PROTOCOL
  const arr = id.split(".....");
  if (arr[0] === "income") {
    axios.delete(path + "delete-income/" + arr[1]);
  } else {
    axios.delete(path + "delete-expense/" + arr[1]);
  }
  displayTransaction();
}

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}

function addTransaction() {
  let category = "category";
  let description = "description";
  let type = document.querySelector("#transaction-type").value;
  let amount = document.querySelector("#amount").value;
  let title = document.querySelector("#title").value;
  let date = document.querySelector("#date").value;
  if (
    type === "" ||
    amount === null ||
    date === "" ||
    title === null ||
    amount < 0 ||
    title.legth >= 10
  ) {
    window.alert("Details are invalid");
  } else {
    axios.post(path + "add-" + type, {
      title: title,
      amount: amount,
      description: description,
      category: category,
      date: date,
    });
    document.querySelector("#transaction-type").value = "";
    document.querySelector("#amount").value = "";
    document.querySelector("#title").value = "";
    document.querySelector("#date").value = "";
  }
  displayTransaction();
}

function filter() {
  let incomes;
  let expenses;
  transactions = [];
  appendList.innerHTML = "";
  axios.get(path + "get-incomes").then((response) => {
    incomes = response.data;
    axios.get(path + "get-expenses").then((response) => {
      expenses = response.data;

      for (let transaction of expenses) {
        transactions.push(transaction);
        totalExpense += transaction["amount"];
      }
      for (let task of incomes) {
        transactions.push(task);
        totalIncome += task["amount"];
      }
      task = document.querySelector("#filter").value;
      if (task === "daterev") {
        transactions.sort(sortByProperty(date));
      } else if (task === "date") {
        transactions.sort(sortByProperty(date)).reverse();
      } else if (task === "amountHigh") {
        transactions.sort(sortByProperty(date));
      } else {
        transactions.sort(sortByProperty(date)).reverse();
      }
      sortAndDisplay(transactions);
    });
  });
}

displayTransaction();

document.querySelector("#date").max = new Date().toJSON().slice(0, 10);
