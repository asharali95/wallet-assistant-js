/* overall code I did here:
----------------------------
-auth related stuff
     i.  signup with custom email
     ii. signin with custom email
     iii. signup with google.

*/
// global variables:
//----------------------------------
var auth = firebase.auth()
var firestore = firebase.firestore()
var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
var googleSignupButton = document.querySelector(".googleSignup");
//----------------------------------


//global function:
//----------------------------------
/* 
 steps we did here:
 i.   signup form values
 ii.  create user on firebase auth
 iii. id returned by firebase auth is used to make user collection 
  and store user info
 iv. format user data in object
  v. store user data to firestore
  vi. redirect to dashboard page
*/
var signupFormSubmission = async (e) => {
    e.preventDefault();
    try{
    var fullName = document.querySelector(".signupFullName").value
    var email = document.querySelector(".signupEmail").value
    var password = document.querySelector(".signupPassword").value
    if(fullName && email && password){ //empty string false hoti hamesha
        //create user in auth section
        var {user:{uid}} = await auth.createUserWithEmailAndPassword(email,password) 

        //store user data in firestore
            var userInfo = {
                fullName,
                email,
                createdAt: new Date()
            }
           
         await firestore.collection("Users").doc(uid).set(userInfo)
         console.log("sign up successful")
         signupForm.reset()
        }
    }
    catch(error){
        console.log(error)
    }
} 
/* 
 steps I did in this function
  i.   collect form values
  ii.  logged already exist user
  iii. redirect to dashboard along with uid 
*/
var signinFormSubmission = async (e) => {
    e.preventDefault();
    try {
        var email = document.querySelector(".signinEmail").value
        var password = document.querySelector(".signinPassword").value
        if(email && password){
            // login user
        var {user: {uid}} = await auth.signInWithEmailAndPassword(email,password)
        location.assign(`./dashboard.html#${uid}`)
        }
    } catch (error) {
        console.log(error)
    }
 } 
/* 
 steps I did in this function:

  i.   I use googleAuthProvider provided by firebase authentication.
  ii.  check if new user:
           . fetch user information from google
           . format user data in object
           . store that user data in firestore
           . redirect to dashboard along with uid
        if old user:
           . redirect to dashboard with uid 
*/
var googleSignin = async() =>{
   try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    var {additionalUserInfo:{isNewUser},user:{displayName,uid,email}}  = await auth.signInWithPopup(googleProvider)

   if(isNewUser){
    var userInfo = {
        fullName : displayName,
        email,
        createdAt: new Date()
    }
    // console.log(userInfo)
    await firestore.collection("Users").doc(uid).set(userInfo);
    location.assign(`./dashboard.html#${uid}`)
   } 
   location.assign(`./dashboard.html#${uid}`)
   } catch (error) {
    console.log(error)
   }
}
//----------------------------------

// all event Listeners: 
//----------------------------------
signinForm.addEventListener("submit" ,(e)=>signinFormSubmission(e));
signupForm.addEventListener("submit" ,(e)=>signupFormSubmission(e));
googleSignupButton.addEventListener("click",googleSignin);

// auth.onAuthStateChanged(async(user) =>{
//     if(user){
//         var {uid} = user
//         location.assign(`./dashboard.html#${uid}`)
//     }
// // yeh listener 3 conditions pe chalta hai
//     // i. on initial page load
//     // ii. on auth state change (signin, signout)
// })
//----------------------------------