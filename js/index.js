var auth = firebase.auth()
var firestore = firebase.firestore()

var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
// console.log(signinForm)
// console.log(signupForm)

var signinFormSubmission = async (e) => {
    e.preventDefault();
    // console.log("sign in")
    try {
        var email = document.querySelector(".signinEmail").value
        var password = document.querySelector(".signinPassword").value
        if(email && password){
            // login user
        var {user: {uid}} = await auth.signInWithEmailAndPassword(email,password)
        // fetch user from database
        var userInfo = await firestore.collection("Users").doc(uid).get();
        // console.log(userInfo.data())

        //redirect
        // "/dashboard.html#{uid}"
        }
    } catch (error) {
        console.log(error)
    }
 }

var signupFormSubmission = async (e) => {
    e.preventDefault();
    try{
    // console.log("sign up")
    var fullName = document.querySelector(".signupFullName").value
    var email = document.querySelector(".signupEmail").value
    var password = document.querySelector(".signupPassword").value
    if(fullName && email && password){ //empty string false hoti hamesha
        //create user in auth section
        var {user:{uid}} = await auth.createUserWithEmailAndPassword(email,password) 
           // console.log(uid)

            //store user data in firestore
            var userInfo = {
                fullName,
                email,
                createdAt: new Date()
            }
            console.log(userInfo)
            await firestore.collection("Users").doc(uid).set(userInfo)
            console.log("done")
            //redirect to dashboard page
           // "/dashboard.html#{uid}"
    }
}   catch(error){
    console.log(error)
}
}

signinForm.addEventListener("submit" ,(e)=>signinFormSubmission(e));
signupForm.addEventListener("submit" ,(e)=>signupFormSubmission(e));
