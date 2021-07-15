import { setupCanvas, draw, clear } from "./renderer.js";
import { controller, collisionDetection, CONST_SCALE } from "./controls.js";
import { Player, Enemy, Wall, generateMap, gameObjects } from "./gameobjects.js";

setupCanvas();
generateMap();

//######### Game Objects ##########//

var player = new Player(2 * CONST_SCALE, 2 * CONST_SCALE, CONST_SCALE, CONST_SCALE, "blue");
var enemy = new Enemy(7 * CONST_SCALE, 7 * CONST_SCALE, CONST_SCALE, CONST_SCALE, "red");

gameObjects.unshift(player, enemy);
//################################//

var collisionObjects = [...gameObjects];
collisionObjects.shift();

// console.log(gameObjects);
// console.log(collisionObjects);


function main() {
    requestAnimationFrame(main);
    clear();
    controller(player);
    collisionDetection(player, collisionObjects)
    draw(gameObjects);
}

main();
