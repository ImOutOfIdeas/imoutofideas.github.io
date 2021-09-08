/**
 *  Set the Variables to Your Liking
 * 
 *  Speed: How fast the input moves
 *  Freq: How often it changes direction IN MILISECONDS
 * 
 * 
 *  Have Fun!
 */

var speed = 20;
var freq = 450;


const username = document.querySelector("#username");
const password = document.querySelector("#password");
const submit = document.querySelector("#submit");


function getRoc() {
    max = speed
    min = -max;
    rocX = Math.random() * (max - min) + min;
    rocY = Math.random() * (max - min) + min;
    rocXp = Math.random() * (max - min) + min;
    rocYp = Math.random() * (max - min) + min;
    rocXs = Math.random() * (max - min) + min;
    rocYs = Math.random() * (max - min) + min;
}

x = window.innerWidth/2;
y = window.innerHeight/2;
rocX = Math.random() * 20 - 10;
rocY = Math.random() * 20 - 10;
pos = {};

xp = window.innerWidth/2;
yp = window.innerHeight/2;
rocXp = Math.random() * 20 - 10;
rocYp = Math.random() * 20 - 10;
posp = {};


xs = window.innerWidth/2;
ys = window.innerHeight/2;
rocXs = Math.random() * 20 - 10;
rocYs = Math.random() * 20 - 10;
poss = {};



function render() {
    requestAnimationFrame(render);
        
    // Collision Detection
    var top = parseInt(username.style.top)    // Data for
    var left = parseInt(username.style.left)  // Collisions
    
    if(top < -1) { // Upper Bound
        username.style.top = 10 + "px";
        rocY = -rocY;
    }
    if(top > window.innerHeight - 39) { // Lower Bound
        username.style.top = window.innerHeight - 50 + "px";
        rocY = -rocY;
    }
    if(left < -1) { // Left Bound
        username.style.left = 10 + "px";
        rocX = -rocX;
    }
    if(left > window.innerWidth - 239) { // Right Bound
        username.style.left = window.innerWidth - 228 + "px";
        rocX = -rocX;
    }


    // Update and Set Position
    x += rocX;
    y += rocY;
    username.style.left = `${x}px`;
    username.style.top = `${y}px`;

    pos.x = x;
    pos.y = y;
    
}



function renderp() {
    requestAnimationFrame(renderp);
        
    // Collision Detection
    var top = parseInt(password.style.top)    // Data for
    var left = parseInt(password.style.left)  // Collisions
    
    if(top < -1) { // Upper Bound
        password.style.top = 0 + "px";
        rocYp = -rocYp;
    }
    if(top > window.innerHeight - 39) { // Lower Bound
        password.style.top = window.innerHeight - 40 + "px";
        rocYp = -rocYp;
    }
    if(left < -1) { // Left Bound
        password.style.left = 0 + "px";
        rocXp = -rocXp;
    }
    if(left > window.innerWidth - 239) { // Right Bound
        password.style.left = window.innerWidth - 238 + "px";
        rocXp = -rocXp;
    }


    // Update and Set Position
    xp += rocXp;
    yp += rocYp;
    password.style.left = `${xp}px`;
    password.style.top = `${yp}px`;

    posp.x = xp;
    posp.y = yp;

}


function renders() {
    requestAnimationFrame(renders);
        
    // Collision Detection
    var top = parseInt(submit.style.top)    // Data for
    var left = parseInt(submit.style.left)  // Collisions
    
    if(top < -1) { // Upper Bound
        submit.style.top = 0 + "px";
        rocYs = -rocYs;
    }
    if(top > window.innerHeight - 39) { // Lower Bound
        submit.style.top = window.innerHeight - 40 + "px";
        rocYs = -rocYs;
    }
    if(left < -1) { // Left Bound
        submit.style.left = 0 + "px";
        rocXs = -rocXs;
    }
    if(left > window.innerWidth - 239) { // Right Bound
        submit.style.left = window.innerWidth - 238 + "px";
        rocXs = -rocXs;
    }


    // Update and Set Position
    xs += rocXs;
    ys += rocYs;
    submit.style.left = `${xs}px`;
    submit.style.top = `${ys}px`;

    poss.x = xs;
    poss.y = ys;

}


setInterval(getRoc, freq); // Change Travel Direction

render();
renderp();
renders();
