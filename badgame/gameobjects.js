//######### IMPORTANT ###########//
const CONST_SCALE = 50; // for dynamic resizing (not yet implemented)
var GAME_SCALE = CONST_SCALE;
//##############################//


var gameObjects = [];
var collisionObjects = [];


class Player {
    constructor(x, y, width, height, color) {
        this.y = y;
        this.x = x;
        this.width  = width;
        this.height = height;
        this.color = color;
        this.pos = [this.x, this.y, this.width, this.height];
    }
}

class Enemy {
    constructor(x, y, width, height, color) {
        this.y = y;
        this.x = x;
        this.width  = width;
        this.height = height;
        this.color = color;
    }
}

class Wall {
    constructor(x, y, width, height, color) {
        this.y = y;
        this.x = x;
        this.width  = width;
        this.height = height;
        this.color = color;
    }
}

//############## Make Player ##############//
var player = new Player(2 * CONST_SCALE, 2 * CONST_SCALE, CONST_SCALE, CONST_SCALE, "limegreen");

gameObjects.unshift(player);
//########################################//


//########## Map Handling ############//
var map = {
    cols: 15, rows: 15, tileSize: CONST_SCALE,
    tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    getTile: function (col, row) {
        return this.tiles[row * map.cols + col];
    },
    setTile: function (col, row, val) {
        let index = row * map.cols + col
        map.tiles.splice(index, 1, val);
    }
};

function generateMap() {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile == 1) {
                let x = c * map.tileSize;
                let y = r * map.tileSize;
                let width = map.tileSize;
                let height = map.tileSize;
                let color = "darkorange";
                gameObjects.push(new Wall(x, y, width, height, color));
                collisionObjects.push(new Wall(x, y, width, height, color));
            }
            if (tile == 2) {
                let x = c * map.tileSize;
                let y = r * map.tileSize;
                let width = map.tileSize;
                let height = map.tileSize;
                let color = "crimson";
                gameObjects.push(new Enemy(x, y, width, height, color));
                collisionObjects.push(new Enemy(x, y, width, height, color));
            }
        }
    }
};

export { player, gameObjects, collisionObjects, generateMap, map };
