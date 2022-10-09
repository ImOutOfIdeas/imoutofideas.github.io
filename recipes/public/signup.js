import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

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


document.getElementById("submit").addEventListener("click", () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        // window.location.assign('http://192.168.1.227:3000');
        window.location.assign('https://imoutofideas.github.io/recipes/index.html');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);

        if (errorCode == "auth/invalid-email") {
            document.getElementById("error").innerHTML = "Please enter a valid email address";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        }
        if (errorCode == "auth/weak-password") {
            document.getElementById("error").innerHTML = "Password must be at least six characters";
            document.getElementById("password").value = "";
        }
        document.getElementById("error").classList.add("visible"); 
    });
});
