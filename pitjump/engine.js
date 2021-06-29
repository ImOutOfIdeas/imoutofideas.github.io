window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keyShift = false;
var keySpace = false;

var moving = false;
var gravity = 5;
var jumpForce = 20;
var velocity = 0; // find way to calc this from two x-y vals
var sprintMod = 1;
var speed = 5;


function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 16: //shift
            keyShift = true;
            break;
        case 32: //space
            keySpace = true;
            break;
        case 68: //d
            keyD = true;
            moving = true;
            break;
        case 65: //a
            keyA = true;
            moving = true;
            break;
        case 83: //s
            keyS = true;
            moving = true;
            break;
        case 87: //w
            keyW = true;
            moving = true;
            break;
      }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 16:
            keyShift = false;
            break;
        case 32: //space
            keySpace = false;
            break;
        case 68: //d
            keyD = false;
            moving = false;
            break;
        case 83: //s
            keyS = false;
            moving = false;
            break;
        case 65: //a
            keyA = false;
            moving = false;
            break;
        case 87: //w
            keyW = false;
            moving = false;
            break;
    }
}

function controller(gameObject) {
    if (keyShift == true) {
        sprintMod = 1.8;
    }
    if (keyShift == false) {
        sprintMod = 1;
    }
    if (keyA == true) {
        gameObject.x -= speed * sprintMod;
        //currentDirection = 1;
    }
    if (keyD == true) {
        gameObject.x += speed * sprintMod;
        //currentDirection = 2;
    }
    // if (keyS == true) {
        //     gameObject.y += speed * sprintMod;
        //     //currentDirection = 0;
        // }
        // if (keyW == true) {
            //     gameObject.y -= speed * sprintMod;
            //     //currentDirection = 3;
            // }
}

// Physics
function collisionDetection(gameObject, collObject) {
    if (gameObject.y + gameObject.height >= collObject.y &&
        gameObject.y < collObject.y + collObject.height &&
        gameObject.x + gameObject.width> collObject.x &&
        gameObject.x + gameObject.width < collObject.y + collObject.width + gameObject.width) {
        gravity = 0;
        console.log("gravity 0");
    } else {
        gravity = 7;
        console.log("gravity 7");

    }
}

// if (keySpace == true) {
    //
    // }
    //     console.log("gravity: " ,gravity);

function boundaryDetection(gameObject) {
    gameObject.y += gravity;

    if (gameObject.y < canvas.height - 30) {
        gravity = 5;
    }
    if (gameObject.y >= canvas. height - 30) {
        gravity = 0;
    }
    if (gameObject.x < 0) {
         gameObject.x = 0;
    }
    if (gameObject.x > canvas.width - 45) {
         gameObject.x = canvas.width - 45;
    }
    // if (gameObject.y < 125) {
    //      gameObject.y = 125;
    // }
    // if (gameObject.y > canvas.height - 105) {
    //      gravity = 0;
    // }
}

export {  onKeyUp, onKeyDown, controller, keyW, keyA, keyS, keyD,
    keyShift, keySpace, moving, gravity, jumpForce,
    velocity, sprintMod, speed , boundaryDetection,
    collisionDetection};
