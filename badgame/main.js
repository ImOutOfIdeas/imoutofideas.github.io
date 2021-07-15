import { setupCanvas, draw, clear, gameObjects } from "./renderer.js";
import { controller, collisionDetection, GAME_SCALE } from "./controls.js";
import { Player, Enemy, Wall } from "./gameobjects.js";


setupCanvas();


          ///////////////////
        ///// Objects /////
      ///////////////////

var player = new Player(1 * GAME_SCALE, 1 * GAME_SCALE, GAME_SCALE, GAME_SCALE, "blue");
var enemy = new Enemy(3 * GAME_SCALE, 3 * GAME_SCALE, GAME_SCALE, GAME_SCALE, "red");

gameObjects.push(player, enemy);

var collisionObjects = [...gameObjects];
collisionObjects.shift();


console.log(gameObjects);
console.log(collisionObjects);
//############################//

function main() {
    requestAnimationFrame(main);
    clear();
    controller(player);
    collisionDetection(player, collisionObjects)
    draw(gameObjects);
}

main();
