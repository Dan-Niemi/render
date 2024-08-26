const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let playerList = {};
let state = 0; //0,1,2 for pre, during, and post game
let finishOrder = [];
const CLICK_GOAL = 5;

io.on("connection", (socket) => {
  socket.emit("newConnection", socket.id,playerList);
  
  if(!Object.keys(playerList).length){
    console.log('set state')
    state = 0
  }
  socket.emit("setState", state);

  socket.on("newPlayer", (name) => {
    playerList[socket.id] = { name: name, count: 0, finished: false };
    io.emit("updateScores", playerList);
  });

  socket.on("startGame", () => {
    if (state != 1) {
      state = 1;
      Object.values(playerList).forEach((obj) => {
        obj.count = 0;
        obj.finished = false;
      });
      finishOrder = [];
      io.emit("gameStarted", playerList, finishOrder);
    }
  });

  socket.on("click", () => {
    if (playerList[socket.id] && state == 1) {
      playerList[socket.id].count++;

      if (playerList[socket.id].count >= CLICK_GOAL) {
        playerList[socket.id].finished = true;
        finishOrder.push(playerList[socket.id].name);
        io.emit("playerFinished", finishOrder);
      }
      io.emit("updateScores", playerList);
      checkEnd();
    }
  });

  socket.on("disconnect", () => {
    delete playerList[socket.id];
    io.emit("updateScores", playerList);
    checkEnd();
  });

  function checkEnd() {
    if (Object.values(playerList).every((obj) => obj.count >= CLICK_GOAL)) {
      state = 2;
      io.emit("gameEnded");
    }
  }
});

app.use(express.static("public"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
