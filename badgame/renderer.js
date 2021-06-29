//manages first time setup and canvas resize events
var ctx;

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

function draw(gameObject) {
    ctx.fillStyle = gameObject.color;
    ctx.fillRect(gameObject.x, gameObject.y,
                gameObject.width, gameObject.height);
}

export { ctx, setupCanvas, draw };
