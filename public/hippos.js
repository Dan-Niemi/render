function data() {
	return {
		players: [
			{ name: 'Alan', score: 0, color: 'blue' },
			{ name: 'Bob', score: 0, color: 'blue' },
			{ name: 'Carson', score: 0, color: 'blue' },
			{ name: 'Dan', score: 0, color: 'blue' },
		],
		get numPlayers() {
			return this.players.length
		},
		get centerX() {
			return window.innerWidth / 2
		},
		get centerY() {
			return window.innerHeight / 2
		},
		get radius() {
			return Math.min(this.centerX, this.centerY) - 100
		},

		init() {
			this.arrangePlayers();
			window.addEventListener('resize', this.arrangePlayers.bind(this));
		},
		arrangePlayers() {
			this.players.forEach((player, index) => {
				const angle = (index / this.numPlayers) * 2 * Math.PI - Math.PI / 2; //Math.PI/2 to rotate quarter turn counter clockwise so player 1 on top
				player.posX = this.centerX + this.radius * Math.cos(angle);
				player.posY = this.centerY + this.radius * Math.sin(angle);
			})
		},
		addPlayer(name) {
			this.players.push({ name: name, score: 0, color: getRandomHSL() });
			this.arrangePlayers()
		}
	}
}

function getRandomHSL() {
	const h = Math.floor(Math.random() * 360); // Random hue between 0 and 360
	return `hsl(${h}, 100%, 50%)`;
}

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});








