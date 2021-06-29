class Player {
    constructor(x, y, width, height, color) {
        this.y = y;
        this.x = x;
        this.width  = width;
        this.height = height;
        this.color = color;
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

export {Player, Enemy, Wall};
