window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keySpace = false;
var currentDirection = 1;
var canMove = true;
var speed = 50;


function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        // case 16: //shift
        //     keyShift = true;
        //     break;
        case 32: //space
            keySpace = true;
            break;
        case 68: //d
            keyD = true;
            canMove = false;
            break;
        case 65: //a
            keyA = true;
            canMove = false;
            break;
        case 83: //s
            keyS = true;
            canMove = false;
            break;
        case 87: //w
            keyW = true;
            canMove = false;
            break;
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        // case 16:
        //     keyShift = false;
        //     break;
        case 32: //space
            keySpace = false;
            break;
        case 68: //d
            keyD = false;
            canMove = true;
            break;
        case 83: //s
            keyS = false;
            canMove = true;
            break;
        case 65: //a
            keyA = false;
            canMove = true;
            break;
        case 87: //w
            keyW = false;
            canMove = true;
            break;
    }
}

function controller(gameObject) {
    if (keyW == true) {
        gameObject.y -= speed;
        currentDirection = 1;
        canMove = false;
    }
    if (keyA == true) {
        gameObject.x -= speed;
        currentDirection = 2;
        canMove = false;
    }
    if (keyS == true) {
        gameObject.y += speed;
        currentDirection = 3;
        canMove = false;
    }
    if (keyD == true) {
        gameObject.x += speed;
        currentDirection = 4;
        canMove = false;
    }
    if (canMove) {
        speed = 50;
    }
    if (!canMove) {
        speed = 0;
    }
}


export { controller };
