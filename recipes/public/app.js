import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
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
const db = getFirestore(app);

// Detect Auth State
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("Logged In As: ", user.email);
        login();
    }
    else {
        console.log("Not Logged In.");
    }
});

// 
document.getElementById("submit").addEventListener ("click", () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    console.log(email, password);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
});

async function login() {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
}