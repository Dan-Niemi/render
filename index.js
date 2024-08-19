const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);



let clickCounts={};

io.on('connection', (socket) => {
	clickCounts[socket.id] = 0;

	io.emit('updateScores',clickCounts);
	
	socket.on('click', ()=>{
		clickCounts[socket.id]++;
		io.emit('updateScores',clickCounts);
	});

	socket.on('disconnect', () => {
		delete clickCounts[socket.id];
		io.emit('updateScores',clickCounts);
	});
});

app.use(express.static('public'));


const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

