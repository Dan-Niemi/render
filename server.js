const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let playerList = [{}];
let state = 0; //0,1,2 for pre, during, and post game
let finishOrder = [];
const CLICK_GOAL = 5;

io.on("connection", (socket) => {
  
  io.emit('newConnection',socket.id)
  socket.on("newPlayer", (name) => {
    playerList[socket.id] = { name: name, count: 0, finished: false };
    io.emit("updateScores", playerList);
  });

  socket.on("startGame", () => {
    if (state != 1) {
      state = 1;
      Object.values(playerList).forEach((player) => (player.score = 0));
      finishOrder = [];
      io.emit("gameStarted");
    }
  });

  socket.on("click", () => {
    if (playerList[socket.id] && state == 1) {
      playerList[socket.id].count++;

      if (playerList[socket.id].count >= CLICK_GOAL) {
        playerList[socket.id].finished = true;
        finishOrder.push(playerList[socket.id].name);
      }

      io.emit("updateScores", playerList);

      if (finishOrder.length === Object.keys(playerList).length) {
        state = 2
        io.emit("gameEnded", finishOrder);
      }
    }
  });

  socket.on("disconnect", () => {
    delete playerList[socket.id];
    io.emit("updateScores", playerList);
  });
});

app.use(express.static("public"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
