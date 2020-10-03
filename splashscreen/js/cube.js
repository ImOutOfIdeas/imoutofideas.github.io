canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var cube;
var speeds = [-3, -4, -5, 5, 4, 3];
var shifts = [-100, 100];

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = randInt(0, canvas.width - this.width);
    this.y = randInt(0, canvas.height - this.height);
    this.xVel = choose(speeds);
    this.yVel = choose(speeds);
    this.draw = function() {
        var pic = document.getElementById("logo");
        ctx.drawImage(pic, this.x, this.y);
        //ctx.fillStyle = color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.transform = function() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
    this.wallCheck = function(){
        screenTop = 0;
        screenLeft = 0;
        screenRight = canvas.width - this.width;
        screenBottom = canvas.height - this.height;

        if (this.x < screenLeft){this.xVel = -this.xVel;}
        if (this.x > screenRight){this.xVel = -this.xVel;}
        if (this.y > screenBottom){this.yVel = -this.yVel;}
        if (this.y < screenTop){this.yVel = -this.yVel;}
    }
}

cube = new component(200, 110, "red", 300, 300);



function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cube.transform();
    cube.wallCheck();
    cube.draw();
}


addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

setInterval(gameLoop, 1000/60);
