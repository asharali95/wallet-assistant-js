// global variables
var firestore = firebase.firestore();
var auth = firebase.auth();
var transactionCost = document.querySelector(".cost");
var transactionTitle = document.querySelector(".title");
var transactionType = document.querySelector(".transaction-type");
var transactionAt = document.querySelector(".transactionAt");
var transactionId = location.hash.substring(1, location.hash.length);
var transactionForm = document.querySelector(".transactionForm");
var deleteBtn = document.querySelector(".deleteBtn");

var fetchSpecificTransaction = async (transactionId) => {
  try {
    //fetch transaction by it's ID
    var transaction = await firestore
      .collection("transactions")
      .doc(transactionId)
      .get();
    return transaction.data();
  } catch (error) {}
};

var editFormHandler = async (e, transactionId) => {
  try {
    e.preventDefault();
    var updatedTitle = transactionTitle.value;
    var updatedCost = transactionCost.value;
    var updatedTransType = transactionType.value;
    var updatedTransAt = transactionAt.value;
    var updatedTransactionObj = {
      title: updatedTitle,
      cost: parseInt(updatedCost),
      transactionType: updatedTransType,
      transactionAt: new Date(updatedTransAt),
    };
    await firestore
      .collection("transactions")
      .doc(transactionId)
      .update(updatedTransactionObj);
    location.assign(`./dashboard.html`);
  } catch (error) {
    console.log(error);
  }
};

var deleteTransaction = async (transactionId) => {
  try {
    await firestore
      .collection("transactions")
      .doc(transactionId)
      .delete()
      .then(() => {
        location.assign(`./dashboard.html`);
      });
  } catch (error) {
    console.log(error);
  }
};

deleteBtn.addEventListener("click", () => deleteTransaction(transactionId));
// event listeners
// -auth listener
transactionForm.addEventListener("submit", (e) =>
  editFormHandler(e, transactionId)
);
auth.onAuthStateChanged(async (user) => {
  if (user) {
    //form initial value handling
    var {
      title,
      cost,
      transactionType: transType,
      transactionAt: transAt,
    } = await fetchSpecificTransaction(transactionId);

    //setting initial value:
    transactionTitle.value = title;
    transactionCost.value = cost;
    transactionType.value = transType;
    transactionAt.value = transAt.toDate().toISOString().split("T")[0];
  } else {
    location.assign("./index.html");
  }
});
