var gameObjects = [];

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


//########## Map Handling ############//
var map = {
    cols: 10, rows: 10, tileSize: 50,
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

function generateMap(CONST_SCALE) {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile == 1) {
                let x = c * map.tileSize;
                let y = r * map.tileSize;
                let width = map.tileSize;
                let height = map.tileSize;
                let color = "brown";
                gameObjects.push(new Wall(x, y, width, height, color));
            }

        }
    }
};

export {Player, Enemy, Wall, generateMap, gameObjects};
