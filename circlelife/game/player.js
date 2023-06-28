class Player {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.xVel = 0;
        this.yVel = 0;
    }
    update() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}