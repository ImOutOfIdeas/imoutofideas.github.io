import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged , signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
// Add additional SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBlRn1nz8gfmn-005C8WsYYq6irpbCMpHY",
  authDomain: "friendly-recipes-bfa.firebaseapp.com",
  databaseURL: "https://friendly-recipes-bfa-default-rtdb.firebaseio.com",
  projectId: "friendly-recipes-bfa",
  storageBucket: "friendly-recipes-bfa.appspot.com",
  messagingSenderId: "942028263489",
  appId: "1:942028263489:web:4da5ffc9468f9af11ef6c0",
  measurementId: "G-HVFC02L0V2"
};



// Initialize Firebase and relevant services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
        window.location.replace('http://localhost:3000/home.html');
    } else {
        console.log("Not logged in")
    }
});


// Runs when submit is clicked
document.getElementById("submit").addEventListener("click", () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        if (user.emailVerified) {
            // TODO: Replace with Actual Home Page URL
            window.location.replace('http://localhost:3000/home.html');
        } 
        else {
            sendEmailVerification(auth.currentUser)
            .then(() => {
                document.getElementById("loginContainer").style.display = "none";
                document.getElementById("emailVer").style.display = "block";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        document.getElementById("error").classList.add("visible");
        document.getElementById("password").value = "";
    });
});