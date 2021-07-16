import { setupCanvas, draw, clear } from "./renderer.js";
import { controller, collisionDetection } from "./controls.js";
import { player, gameObjects, collisionObjects, enemies, generateMap, map } from "./gameobjects.js";


//############# Init #############//
setupCanvas();
generateMap(map);
//################################//

//########## Game Loop ##########//
function main() {
    requestAnimationFrame(main);
    clear();
    controller(player);
    collisionDetection(player, collisionObjects);
    draw(gameObjects);
}

main();
//##############################//
