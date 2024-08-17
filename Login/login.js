import { auth,createUserWithEmailAndPassword ,signInWithEmailAndPassword,sendPasswordResetEmail,GoogleAuthProvider,provider,signInWithPopup,onAuthStateChanged  } from "../firebase.js";

// signup functionality==============================

let signUpEmail=document.getElementById("signUpEmailInput")
let signUpPass=document.getElementById("signUpPassInput")
let signUpBtn=document.getElementById("signUpBtn")

const signUp=()=>{
    event.preventDefault();
    createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPass.value)
  .then((userCredential) => {
    const user = userCredential.user;
    Toastify({
        text: "Sign Up",
        duration: 3000
        }).showToast();    
  })    
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Toastify({
        text: errorMessage,
        duration: 3000
        }).showToast();  
  });
  signUpEmail.value=""
  signUpPass.value=""
}
signUpBtn.addEventListener("click",signUp)

// login functionality==============================

let logInEmail=document.getElementById("logInEmailInput")
let logInPass=document.getElementById("logInPassInput")
let logInBtn=document.getElementById("logInBtn")

const logIn=()=>{
    event.preventDefault();
    signInWithEmailAndPassword(auth, logInEmail.value, logInPass.value)
  .then((userCredential) => {
    const user = userCredential.user;
    Toastify({
        text:"Log In",
        duration: 3000
        }).showToast();  
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Toastify({
        text: errorMessage,
        duration: 3000
        }).showToast();  
  });
  logInEmail.value=""
  logInPass.value=""
}
logInBtn.addEventListener("click",logIn)

// forgot password functionality==========================

let forgotBtn=document.getElementById("forgotBtn")

const forgotPassword=()=>{
    sendPasswordResetEmail(auth, logInEmail.value)
    .then(() => {
        Toastify({
            text:"Password reset email sent!",
            duration: 3000
            }).showToast();  
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Toastify({
        text:errorMessage,
        duration: 3000
        }).showToast();  
    });
}

forgotBtn.addEventListener("click",forgotPassword)

// login with google password functionality==========================

let googleBtn=document.getElementById("googleBtn")

const loginWithGoogle=()=>{
    event.preventDefault();
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Toastify({
        text:errorMessage,
        duration: 3000
        }).showToast();  
    });
}
googleBtn.addEventListener("click",loginWithGoogle)

// redirection functionality=================

onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    window.location.href="../dashboard/dashboard.html"
    }
  });

  // year functionality===============

let d=new Date();
let currentYear=d.getFullYear();

let year=document.getElementById("year")
year.innerText=currentYear;
