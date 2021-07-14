// Manages Game Object Instantiation

class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.top = y;
        this.left = x;
        this.bottom = y + height;
        this.right = x + width;
    }
}

class Player {
    constructor(x, y, width, height, color, coll) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}


export { Platform, Player };
