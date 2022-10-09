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
    if (user && user.emailVerified) {
        window.location.replace('http://192.168.1.227:3000/home.html');
        // window.location.replace('friendly-recipes-bfa.web.app/home.html');
    }
    else if (user) {
        user.sentEmail = true;
    }
    
    if (window.location.search == "?continue") {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("emailVer").style.display = "block";
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
        if (user.emailVerified) {
            window.location.replace('http://192.168.1.227:3000/home.html');
            // window.location.replace('friendly-recipes-bfa.web.app/home.html');
        } 
        else if (user.sentEmail) {
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("emailVer").style.display = "block";
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

                // Sends to many verification emails
                if (errorCode == "auth/too-many-requests") {
                    document.getElementById("loginContainer").style.display = "none";
                    document.getElementById("emailVer").style.display = "block";
                }
            });
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode == "auth/invalid-email") {
            document.getElementById("error").innerHTML = "Please enter a valid email address";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        }
        else if (errorCode == "auth/internal-error") {
            document.getElementById("error").innerHTML = "No password was provided"
            document.getElementById("error").classList.add("visible");
            document.getElementById("password").value = "";
        }
        else if (errorCode == "auth/user-not-found") {
            document.getElementById("error").innerHTML = "Username or password incorrect"
            document.getElementById("error").classList.add("visible");
            document.getElementById("password").value = "";
        }

        document.getElementById("error").classList.add("visible"); 
    });
});

// Handles Continue Button On Email Verification 
document.getElementById("continue").addEventListener("click", () => {
    window.location.assign("http://192.168.1.227:3000?continue");
    // window.location.assign("friendly-recipes-bfa.web.app?continue");
    
});

// Handles Resend Button On Email Verification 
document.getElementById("resend").addEventListener("click", () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
        document.getElementById("cooldown").style.color = "black";
        document.getElementById("cooldown").innerHTML = "New verification email was sent";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Sends to many verification emails
        if (errorCode == "auth/too-many-requests") {
            document.getElementById("cooldown").style.color = "red";
            document.getElementById("cooldown").innerHTML = "Please wait before sending another.";
        }
    });
});