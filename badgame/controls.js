//######### IMPORTANT ###########//
const CONST_SCALE = 50; // for dynamic resizing (not yet implemented)
var GAME_SCALE = CONST_SCALE;
//##############################//


window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);


var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keySpace = false;
var direction = 1;
var canMove = true;

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
            direction = 2;
            keyD = true;
            canMove = false;
            break;
        case 65: //a
            direction = 4;
            keyA = true;
            canMove = false;
            break;
        case 83: //s
            direction = 3;
            keyS = true;
            canMove = false;
            break;
        case 87: //w
            direction = 1;
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
        gameObject.y -= GAME_SCALE;
        direction = 1;
        canMove = false;
    }
    if (keyA == true) {
        gameObject.x -= GAME_SCALE;
        direction = 2;
        canMove = false;
    }
    if (keyS == true) {
        gameObject.y += GAME_SCALE;
        direction = 3;
        canMove = false;
    }
    if (keyD == true) {
        gameObject.x += GAME_SCALE;
        direction = 4;
        canMove = false;
    }
    if (canMove) {
        GAME_SCALE = CONST_SCALE;
    }
    if (!canMove) {
        GAME_SCALE = 0;
    }
}

function collisionDetection(player, other) {
    for (var i = 0; i < other.length; i++) {
        if (player.x < other[i].x + other[i].width &&
            player.x + player.width > other[i].x &&
            player.y < other[i].y + other[i].height &&
            player.y + player.height > other[i].y) {

            if (keyW == true) {
                player.y += player.height;
                // console.log("Hit Top")
                if (other[i].constructor.name == "Enemy") {
                    player.x = player.xStart;
                    player.y = player.yStart;
                }

            }
            if (keyA == true) {
                player.x += player.width;
                // console.log("Hit Left")
                if (other[i].constructor.name == "Enemy") {
                    player.x = player.xStart;
                    player.y = player.yStart;
                }

            }
            if (keyS == true) {
                player.y -= player.height;
                // console.log("Hit Bottom");
                if (other[i].constructor.name == "Enemy") {
                    player.x = player.xStart;
                    player.y = player.yStart;
                }

            }
            if (keyD == true) {
                player.x -= player.width;
                // console.log("Hit Right");
                if (other[i].constructor.name == "Enemy") {
                    player.x = player.xStart;
                    player.y = player.yStart;
                }
            }
            else {
                canMove = true;
            }
        }
    }
}


export { controller, collisionDetection };
