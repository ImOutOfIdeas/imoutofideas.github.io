import { ctx, setupCanvas, draw } from "./renderer.js";
import { Platform, Player } from "./objects.js";
import {  onKeyUp, onKeyDown, controller, keyW, keyA, keyS, keyD,
    keyShift, keySpace, moving, gravity, jumpForce,
    velocity, sprintMod, speed , boundaryDetection,
    collisionDetection} from "./engine.js";

setupCanvas();

// Object Instantiation
var plat1 = new Platform(20, 250, 200, 30, "green");
var plat2 = new Platform(280, 350, 200, 30, "green");

var player = new Player(30, 100, 20, 60, "black", plat1);


function mainEngine() {
    controller(player);
    boundaryDetection(player);
    collisionDetection(player, plat1);  
}

function mainDraw() {
    draw(player);
    draw(plat1);
    draw(plat2);
}

function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mainDraw();
    mainEngine();
    //setTimeout(render, 60);
}

render();
