
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let isAnimating = false;
let animationFrameId;
let startTime;
const animationDuration = 200;
const easing = t => t * t * (3 - 2 * t); 

function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2); t
	ctx.strokeStyle = 'blue';
	ctx.lineWidth = 5;
	ctx.stroke(); 
	ctx.closePath();
}

function animateLine() {
	if (isAnimating) {
		const elapsedTime = Date.now() - startTime;
		const progress = elapsedTime / animationDuration;

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

		if (progress < 1) {
			// Easing for the outward motion
			let easedProgress = easing(progress);
			let currentX = startX + (endX - startX) * easedProgress;
			let currentY = startY + (endY - startY) * easedProgress;
			drawLine(startX, startY, currentX, currentY);

			// Continue animating if not yet reached end
			animationFrameId = requestAnimationFrame(animateLine);
		} else if (progress < 2) {
			// Reverse animation
			const reverseProgress = (elapsedTime - animationDuration) / animationDuration;
			const easedReverseProgress = easing(reverseProgress);
			let currentX = endX + (startX - endX) * easedReverseProgress;
			let currentY = endY + (startY - endY) * easedReverseProgress;
			drawLine(startX, startY, currentX, currentY);

			// Continue animating if not yet back to start
			animationFrameId = requestAnimationFrame(animateLine);
		} else {
			// Finalize the line to the start position
			drawLine(startX, startY, startX, startY);
			isAnimating = false;
		}
	}
}

canvas.addEventListener('mousedown', (event) => {
	startX = 0; // Start from the top-left corner
	startY = 0;
	const rect = canvas.getBoundingClientRect();
	endX = event.clientX - rect.left; // Mouse position relative to canvas
	endY = event.clientY - rect.top;

	startTime = Date.now();
	isAnimating = true;
	cancelAnimationFrame(animationFrameId);
	animateLine();
});
