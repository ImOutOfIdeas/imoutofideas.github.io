import { setupCanvas, draw, clear, gameObjects } from "./renderer.js";
import {Player, Enemy, Wall} from "./gameobjects.js";
import { controller } from "./controls.js";


setupCanvas();


          ///////////////////
        ///// Objects /////
      ///////////////////

var player = new Player(50, 50, 50, 50, "blue");
var enemy = new Enemy(150, 150, 50, 50, "red");


gameObjects.push(player, enemy); // Put
//############################//

function main() {
    requestAnimationFrame(main);
    clear();
    controller(player);
    draw(gameObjects);
}

main();
