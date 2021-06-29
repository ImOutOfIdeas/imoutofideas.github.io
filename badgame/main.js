import { ctx, setupCanvas, draw } from "./renderer.js";
import {Player, Enemy, Wall} from "./gameobjects.js";


import { keyW, keyA, keyS, keyD, keySpace, onKeyDown,
         onKeyUp, controller, canMove} from "./controls.js";


setupCanvas();


            ///////////////////
          ///// Objects /////
        ///////////////////

var player = new Player(50, 50, 50, 50, "black");



function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    controller(player);
    draw(player);
}

gameLoop();
