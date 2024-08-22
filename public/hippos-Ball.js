export default class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.velX = Math.random() * 4 - 2;
		this.velY = Math.random() * 4 - 2;
		this.radius = 20;
		this.friction = 0.995;
		this.color = 'red'
	}
	update() {
		this.velX *= this.friction
		this.velY *= this.friction
		this.x += this.velX;
		this.y += this.velY;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
	get isMoving() {
		return Math.abs(this.velX) > 0.1 || Math.abs(this.velY) > 0.1;
	}
	animate() {
		if (this.isMoving) {
			this.update();
		}
		this.draw();
	}
	isTouching(x, y) {
		const dx = this.x - x
		const dy = this.y - y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance <= this.radius;
	}
}