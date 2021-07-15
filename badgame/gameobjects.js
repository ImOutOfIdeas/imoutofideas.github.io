const gameObjects = [];

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
        gameObjects.push(this.name);
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

export {Player, Enemy, Wall};
