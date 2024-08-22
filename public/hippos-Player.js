export default class Player {
	constructor(name) {
		this.name = name || 'player';
		this.score = 0;
		this.color = 'blue';
		this.posX = null;
		this.posY = null;
		this.offset = 32;
	}
	animateLine(x2, y2, duration = 100) {
		const x1 = this.posX + this.offset;
		const y1 = this.posY + this.offset;
		let startTime = null;

		const drawLine = (progress) => {
			let eased = progress * progress * (3 - 2 * progress); 
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const currentX = x1 + (x2 - x1) * eased;
			const currentY = y1 + (y2 - y1) * eased;
			// Draw the line
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(currentX, currentY);
			ctx.stroke();
		};

		const animate = (timestamp) => {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			let progress = elapsed / duration;

			if (progress <= 1) {
				drawLine(progress);
				requestAnimationFrame(animate);
			} else if (progress <= 2) {
				drawLine(2 - progress);
				requestAnimationFrame(animate);
			} else {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		};
		requestAnimationFrame(animate);
	}
}
