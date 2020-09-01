window.onload = function() {
	initialize();
}

var canvas;
var CANVAS_HEIGHT;
var CANVAS_WIDTH;
var running = false;
var player
var rightPressed = false;
var leftPressed = false;
var score = 0;


class Player {
	constructor(x, y, radius, color, speed) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.speed = speed;
	}

	draw(ctx) {
		drawCircle(this.x, this.y, this.radius, this.color, ctx);
	}

	update() {
		if(leftPressed) {
			this.x -= this.speed;
		}
		if(rightPressed) {
			this.x += this.speed;
		}

		if (this.x - this.radius < 0) {
			this.x = this.radius
		}
		if (this.x + this.radius > CANVAS_WIDTH) {
			this.x = CANVAS_WIDTH - this.radius;
		}
	}
}

function addKeyListeners() {
	window.addEventListener("keydown", function (event) {
		if (event.key == "ArrowLeft" || event.key == "a") {
			leftpressed = true;
		}
		if (event.key == "ArrowRight" || event.key == "d") {
			rightpressed = true;
		}
	}
	window.addEventListener("keyup", function (event)) {
		if (event.key == "ArrowLeft" || event.key == "a") {
			leftpressed = false;
		}
		if (event.key == "ArrowRight" || event.key == "d") {
			rightpressed = false;
		}
	}
}

function initialize() {
	canvas = document.getElementById("canvas");
	CANVAS_HEIGHT = canvas.height;
	CANVAS_WIDTH = canvas.width;
	player = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT-10, 10, "#FF0000", 4);
	addKeyListeners();
	startLoop();
}

function startLoop() {
	running = true;
	setInterval(loop, 10);
}

function loop() {
	if (running) {
		update();
		draw();
	}
}

function update() {
	player.update();
}

function draw() {
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawBackground(ctx);
	player.draw(ctx);
}
