let transactions = [];
let myChart;

fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    // create and populate a table row
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  let labels = reversed.map(t => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  let data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}
///////////////////////////OFFLINE CODE/////////////////////////////////////////////


const dbName = "budget";

var request = indexedDB.open(dbName, 2);

request.onerror = function(event) {
  console.log('Whoops indexddb error:', error);
};

request.onsuccess = event => {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique - or at least that's what I was told during the kickoff meeting.
  var objectStore = db.createObjectStore('budget', { autoIncrement: true });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex('pendingIndex', 'pending');

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  // objectStore.transaction.oncomplete = function(event) {
  //   Store values in the newly created objectStore.
  //   var budgetObjectStore = db.transaction('budget', "readwrite").objectStore("budget");
  //     budgetObjectStore.add(record);
  // };
};
///////////////////////////OFFLINE CODE/////////////////////////////////////////////


saveRecord = record => {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(['budget'], 'readwrite');
  // access your pending object store
  const budgetPending = transaction.objectStore('budget');
  // add record to your store with add method.
  budgetPending.add(record);


};

checkDatabase = () => {
  // open a transaction on your pending db
 transaction = db.transaction(['budget'], 'readwrite');
  // access your pending object store
  const budgetPending = transaction.objectStore('budget');
 
  const getRequest = budgetPending.getAll();
 
  // access your pending object store
  // get all records from store and set to a variable
  getRequest.onsuccess = () => {
    if (getRequest.result.length > 0) {
                budgetPending.clear();
                sendTransaction(JSON.stringify(getRequest.result));

    //   fetch('/api/transaction/bulk', {
    //     method: 'POST',
    //     body: JSON.stringify(getRequest.result),
    //     headers: {
    //       Accept: 'application/json, text/plain, */*',
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then(response => response.json())
    //     .then(() => {
    //       // if successful, open a transaction on your pending db
    //       const transaction = db.transaction(['budget'], 'readwrite');
    //       // access your pending object store
    //       const budgetPending = transaction.objectStore('budget');
    //       // clear all items in your store
    //       budgetPending.clear();
    //     });
    // }
  };
};
};
// listen for app coming back online
window.addEventListener('online', checkDatabase);



///////////////////////////OFFLINE CODE/////////////////////////////////////////////


function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();


  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};
