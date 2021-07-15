import { setupCanvas, draw, clear, gameObjects, ctx } from "./renderer.js";
import { controller, collisionDetection, CONST_SCALE } from "./controls.js";
import { Player, Enemy, Wall } from "./gameobjects.js";


setupCanvas();


//########## Map Handling ############//
const tileAtlas = new Image(100, 100);
tileAtlas.src = "./tileset.png";
tileAtlas.style.zIndex = 10;

ctx.drawImage(tileAtlas, 100, 100, 100, 100);

var map = {
    cols: 10, rows: 10, tileSize: CONST_SCALE,
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,

    ],
    getTile: function (col, row) {
        return this.tiles[row * map.cols + col];
    }
};
var walls = [];
var enemies = [];

function generateMap() {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile == 1) {
                let x = c * map.tileSize;
                let y = r * map.tileSize;
                let width = CONST_SCALE;
                let height = CONST_SCALE;
                let color = "brown";
                walls.push(new Wall(x, y, width, height, color));
            }

        }
    }
    //console.log(walls);
};



//######### Game Objects ##########//

var player = new Player(2 * CONST_SCALE, 2 * CONST_SCALE, CONST_SCALE, CONST_SCALE, "blue");
var enemy = new Enemy(7 * CONST_SCALE, 7 * CONST_SCALE, CONST_SCALE, CONST_SCALE, "red");

gameObjects.push(player, enemy);
//################################//

var collisionObjects = [...gameObjects];
collisionObjects.shift();

console.log(gameObjects);

generateMap();

function main() {
    requestAnimationFrame(main);
    clear();
    controller(player);
    collisionDetection(player, collisionObjects)
    collisionDetection(player, walls)
    draw(walls);
    draw(gameObjects);
}

main();
