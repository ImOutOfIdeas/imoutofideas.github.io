import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
    } else {
        // Takes back to login if not a valid user
        window.location.replace('http://192.168.1.227:3000');
        // window.location.replace('friendly-recipes-bfa.web.app');
    }
});


// Requests recipes from database and makes array of recipe objects (recipes)
const recipes = [];

const querySnapshot = await getDocs(collection(db, "recipes"));
querySnapshot.forEach((doc) => {
    recipes.push({
        "title": doc.id,
        "tags": doc.data().tags,
        "ingredients": doc.data().ingredients,
        "directions": doc.data().directions
    });
});


// Create elements to store each recipe
const container = document.getElementById("recipeContainer");
recipes.forEach(recipe => {
    // Targets Individual Recipe Container
    var div = container.appendChild(document.createElement("div"));

    // Create Element, Set Name To Recipe detail, append to container
    var name = document.createElement("h1");
    name.innerHTML = recipe.title;
    div.appendChild(name);

    // adds all tags from recipe
    recipe.tags.forEach(tag => {
        var description = document.createElement("span");
        description.innerHTML = tag;
        div.appendChild(description);
    });

    // Creates List of items
    var items = document.createElement("ul");
    
    // Adds Each Ingredient to list
    recipe.ingredients.forEach(ingredient => {
        var item = document.createElement("li");
        item.innerHTML = ingredient;
        items.appendChild(item);
    })
    
    // Appends filled list to recipe container
    div.appendChild(items);

    var instructions = document.createElement("p");
    instructions.innerHTML = recipe.directions;
    div.appendChild(instructions);

    console.log(div);
});
    


// Allow Users to upload recipe suggestions
async function addRecipe(name, ingredients, directions) {
    try {
        const docRef = await addDoc(collection(db, "unverified"), {
            ingredients: ingredients,
            directions: directions
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


// FIGURE OUT ACCOUNT PRIVAILAGE
// Allow admin accounts to review, edit, and upload recipes.


// Allow User to log out
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.replace("http://192.168.1.227:3000");
        // window.location.replace('friendly-recipes-bfa.web.app');
    }).catch((error) => {
        console.log(error);
    });
});
