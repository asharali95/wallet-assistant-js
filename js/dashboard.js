/* overall code I did here:
----------------------------
 - fetch user transaction from firestore
 - render page data
    - render user info
    - render user transaction
 - add transaction via transaction form
*/

//global variables: 
//---------------------------------
var firestore = firebase.firestore()
var auth = firebase.auth()
var nameDiv = document.querySelector(".name h3");
var signoutBtn = document.querySelector(".signout-btn")
var transactionForm = document.querySelector(".transactionForm")
var transactionListItem = document.querySelector(".transactionListItem")
var uid = null;
//---------------------------------


//render function

//- render user info:
// fetch user info from user id
// display user info in navbar


//- render transactions:
//fetch user transactions
// calculate current current amount on the basis of fetched transactions
//display current amount on navbar
// display transaction list

var renderTransactions = (transactionArr) => {
    //setting user current amount
    finalCostCalculation(transactionArr)

    transactionListItem.innerHTML = ""
   transactionArr.forEach((transaction,index) => {
    var {title,cost,transactionAt, transactionId, transactionType} = transaction;
       transactionListItem.insertAdjacentHTML("beforeend",
       `<div class='transactionListItemWrapper divDesign ${transactionType ==="income"?"income":"expense"}'>
            <div class="renderindex listitem"><h3>${++index}</h3></div>
            <div class="renderTitle listitem"><h3>${title}</h3></div>
            <div class="renderCost listitem"><h3>${cost}</h3> </div>
            <div class="renderTractionAt listitem"><h3>${transactionAt.toDate().toISOString().split("T")[0]}</h3></div>
            <div class= "renderViewBtn listitem"><a href ="./transaction.html#${transactionId}"><button type ="button" class="ButtonDesign">Edit</button></a> </div>
       </div>
       `)
   })
}
var userSignout =async () =>{
    await auth.signOut()
}
var fetchUserInfo = async (uid)=>{
    try {
        var userInfo = await firestore.collection("Users").doc(uid).get()
        var data = userInfo.data()
        return data;
        // console.log(data.createdAt.toDate().toISOString().split("T")) for date
        console.log(userInfo.data())
    } catch (error) {
        console.log(error)
    }
}
var finalCostCalculation = (transArr) =>{
    var amount = document.querySelector(".amount h2");
    var totalAmount = 0;
    transArr.forEach((transaction) =>{
        var {cost , transactionType} = transaction;
        if(transactionType ==="income"){
            totalAmount = totalAmount+cost
        }
        else{
            totalAmount = totalAmount-cost
        }
    })
    // console.log(totalAmount)
    amount.textContent = `${totalAmount} Rs.`
}
var fetchTransaction =async (uid) =>{
    try {
        var transactions =[];
        var query = await firestore.collection("transactions").where("transactBy","==",uid).orderBy("transactionAt","desc").get() //we have use orderBy and made index in firebase taa k descending me aye.
        // console.log(query)
        query.forEach((doc) =>{     // firebase ne forEach diya hua hai aur koi map ya filter waghera ni lgengy
            // console.log({...doc.data(), transactionId: doc.id}) // humne yahan pe doc id bhi add kri hai taa k us specific transaction ki id fetch kr sakain
            transactions.push({...doc.data(), transactionId: doc.id})
        })
        // console.log(transactions)
        return transactions
    
    } catch (error) {
        
    }
}

var transactionFormSubmission = async (e) =>{
    try {
        e.preventDefault();
    var title = document.querySelector(".title").value
    var cost = document.querySelector(".cost").value
    var transactionType = document.querySelector(".transaction-type").value
    var transactionAt = document.querySelector(".transactionAt").value

    if(title && cost && transactionType && transactionAt){
      var transactionInfoObj ={
          title,
          cost: parseInt(cost),
          transactionType,
          transactionAt : new Date(transactionAt),
          transactBy : uid
      }
      //   console.log(transactionInfo)
      await firestore.collection("transactions").add(transactionInfoObj)
      document.getElementById("abc").reset()
        // re render transactions
        var transactions = await fetchTransaction(uid);
        // console.log(transactions)
        renderTransactions(transactions)
    }
    // document.querySelector(".title").value=" "
    }
    catch (error) {
        console.log(error)  
      }
}

signoutBtn.addEventListener("click",userSignout);
transactionForm.addEventListener("submit",transactionFormSubmission)
// fetchUserInfo(uid)

auth.onAuthStateChanged(async(user) =>{
    if(user){
        uid = user.uid;
        var userInfo = await fetchUserInfo(uid)
        nameDiv.textContent = userInfo.fullName;
        // render transactions
        // fetch user transactions
      var transactions = await fetchTransaction(uid);
        //  render process
        renderTransactions(transactions)
    }
    else{
        location.assign("./index.html");
    }

})