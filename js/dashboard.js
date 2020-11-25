var firestore = firebase.firestore()
var auth = firebase.auth()
var nameDiv = document.querySelector(".name h3");

//fetching uid from url
var uid = location.hash.substring(1,location.hash.length)

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

// fetchUserInfo(uid)

auth.onAuthStateChanged(async(user) =>{
    if(user){
        // console.log("user logged in")
        var {uid} = user;
        var userInfo = await fetchUserInfo(uid)
        // console.log(userInfo)

        nameDiv.textContent = userInfo.fullName;
    }
    else{
        console.log("user not out")
    }
})