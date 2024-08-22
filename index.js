const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let clickCounts = {};
let gameStarted = false;
let finishOrder = [];

io.on('connection', (socket) => {
  let playerName = '';

  socket.on('newPlayer', (name) => {
    playerName = name;
    clickCounts[socket.id] = { name: playerName, count: 0, finished: false };
    io.emit('updateScores', clickCounts);
  });

  socket.on('startGame', () => {
    if (!gameStarted) {
      gameStarted = true;
      finishOrder = [];
      io.emit('gameStarted');
    }
  });

  socket.on('click', () => {
    if (clickCounts[socket.id] && gameStarted && !clickCounts[socket.id].finished) {
      clickCounts[socket.id].count++;
      
      if (clickCounts[socket.id].count >= 50) {
        clickCounts[socket.id].finished = true;
        finishOrder.push(clickCounts[socket.id].name);
      }

      io.emit('updateScores', clickCounts);

      if (finishOrder.length === Object.keys(clickCounts).length) {
        gameStarted = false;
        io.emit('gameEnded', finishOrder);
      }
    }
  });

  socket.on('disconnect', () => {
    delete clickCounts[socket.id];
    io.emit('updateScores', clickCounts);
  });
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
