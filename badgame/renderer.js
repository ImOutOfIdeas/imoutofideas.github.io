var ctx;
var gameObjects = [];


//manages first time setup and canvas resize events
function setupCanvas() {

    ctx = document.getElementById("canvas").getContext('2d');

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    function onResize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;

        if (window.devicePixelRatio > 1) {
           canvas.width = canvas.clientWidth * 2;
           canvas.height = canvas.clientHeight * 2;
           ctx.scale(2, 2);
         } else {
           canvas.width = width;
           canvas.height = height;
         }
    }

    window.addEventListener('resize', onResize);

    // Set the size initially
    onResize();
}

function draw(gameObjects) {
    for (var i = 0; i < gameObjects.length; i++) {
        ctx.fillStyle = gameObjects[i].color;
        ctx.fillRect(gameObjects[i].x, gameObjects[i].y,
                     gameObjects[i].width, gameObjects[i].height);
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


export { setupCanvas, draw, clear, gameObjects, ctx };
