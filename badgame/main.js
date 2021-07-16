import { setupCanvas, draw, clear } from "./renderer.js";
import { controller, collisionDetection } from "./controls.js";
import { player, gameObjects, collisionObjects, enemies, generateMap } from "./gameobjects.js";


//############# Init #############//
setupCanvas();
generateMap();
//################################//

//########## Game Loop ##########//
function main() {
    requestAnimationFrame(main);
    clear(); 
    controller(player);
    collisionDetection(player, collisionObjects);
    draw(gameObjects);

    // Move the enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        setTimeout(500);
    }

}

main();
//##############################//
