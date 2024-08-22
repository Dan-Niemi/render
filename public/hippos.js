import Player from './hippos-Player.js'
import Ball from './hippos-Ball.js'

const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');
const playerCanvas = document.getElementById('playerCanvas');
const playerCtx = playerCanvas.getContext('2d');
window.canvas = canvas;
window.playerCanvas = canvas;
window.ctx = ctx;
window.playerCtx = playerCtx;
window.data = data;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
playerCanvas.width = window.innerWidth;
playerCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	playerCanvas.width = window.innerWidth;
	playerCanvas.height = window.innerHeight;
});

function data() {
	return {
		players: [],
		balls: [],
		get numPlayers() { return this.players.length },
		get centerX() { return window.innerWidth / 2 },
		get centerY() { return window.innerHeight / 2 },
		get playerRadius() { return Math.min(this.centerX, this.centerY) - 100 },
		get courtRadius() { return this.playerRadius - 100 },

		init() {
			setInterval(() => {
				this.createBall()
			}, 1000);
			this.animateBalls();
			this.players.push(new Player('Alan', playerCtx))
			this.players.push(new Player('Bob', playerCtx))
			this.players.push(new Player('Carson', playerCtx))
			this.players.push(new Player('Dan', playerCtx))
			this.arrangePlayers();
			window.addEventListener('resize', this.arrangePlayers.bind(this));
		},
		arrangePlayers() {
			this.players.forEach((player, index) => {
				const angle = (index / this.numPlayers) * 2 * Math.PI - Math.PI / 2; //Math.PI/2 to rotate quarter turn counter clockwise so player 1 on top
				player.posX = this.centerX + this.playerRadius * Math.cos(angle);
				player.posY = this.centerY + this.playerRadius * Math.sin(angle);
			})
		},
		addPlayer(name) {
			this.players.push(new Player(name));
			this.arrangePlayers()
		},

		animateBalls() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.balls.forEach(ball => {
				ball.animate();
			});
			requestAnimationFrame(() => this.animateBalls());
		},

		createBall() {
			const angle = Math.random() * 2 * Math.PI;
			const distance = Math.random() * this.courtRadius;
			const x = this.centerX + distance * Math.cos(angle);
			const y = this.centerY + distance * Math.sin(angle);
			this.balls.push(new Ball(x, y));
		},
		onClick(event){
			const x = event.clientX
			const y = event.clientY
			this.players[0].animateLine(x,y);
			this.balls.forEach(ball => {
				if (ball.isTouching(x,y)){
					ball.color = 'blue'
					setTimeout(() => {
							this.balls.splice(this.balls.indexOf(ball),1)
					}, 500);
				}
			})
		}
	}
}






