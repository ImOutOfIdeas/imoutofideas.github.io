const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const keys = [];

const player = {
    x: 150,
    y: 200,
    width: 32,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 9,
    moving: false
}

const playerSprite = new Image();
playerSprite.src = "images/yoda.png";//"http://untamed.wild-refuge.net/images/rpgxp/disney/aladdin2.png";
const background = new Image();
background.src = "images/background.png";//"https://pixeldra.in/api/file/ZhZrYLJR";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    player.moving = true;
});

window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode];
    player.moving = false;
});

function movePlayer() {
    if (keys[87] && player.y > 100) {
        player.y -= player.speed;
        player.frameY = 3;
        player.moving = true;
    }

    if (keys[68] && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.frameY = 2;
        player.moving = true;
    }

    if (keys[83] && player.y < canvas.height - player.height) {
        player.y += player.speed;
        player.frameY = 0;
        player.moving = true;
    }

    if (keys[65] && player.x > 0) {
        player.x -= player.speed;
        player.frameY = 1;
        player.moving = true;
    }
}

function handlePlayerFrame() {
    if(player.frameX < 3 && player.moving) player.frameX++;
    else player.frameX = 0;
}

/*
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, player.frameX * player.width, player.frameY * player.height, player.width, player.height, player.x, player.y, player.width, player.height);
    movePlayer();
    handlePlayerFrame();
    requestAnimationFrame(animate);
}
animate();*/
// FPS Handling
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    now = Date.now()
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawSprite(playerSprite, player.frameX * player.width, player.frameY * player.height, player.width, player.height, player.x, player.y, player.width, player.height);
        movePlayer();
        handlePlayerFrame();
    }
}
startAnimating(20);
