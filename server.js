const { time } = require("console");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


let playerList = {};
let standings = [];
let state = 0; //0,1,2,3 for pre, countdown, during, and post game
let startTime = null;
const CLICK_GOAL = 5;
const COUNTDOWN_DURATION = 5000; //in ms

io.on("connection", (socket) => {
  socket.emit("newConnection", socket.id, playerList);

  if (!Object.keys(playerList).length) {
    state = 0;
  }
  socket.emit("stateUpdated", state);
  socket.on("newPlayer", (name) => {
    playerList[socket.id] = { name: name, count: 0, finished: false, time: null };
    io.emit("playerListUpdated", playerList);
  });

  socket.on("resetGame", () => {
    state = 0;
    io.emit("stateUpdated", state);
    Object.values(playerList).forEach((obj) => {
      obj.count = 0;
      obj.finished = false;
      obj.time = null
    });
    io.emit("playerListUpdated", playerList);
  });

  socket.on("startCountdown", () => {
    state = 1;
    io.emit("stateUpdated", state);
    io.emit("countdownStarted", COUNTDOWN_DURATION);
    setTimeout(() => {
      startTime = Date.now();
      state = 2;
      io.emit("stateUpdated", state);
    }, COUNTDOWN_DURATION);
  });

  socket.on("click", () => {
    
    if (playerList[socket.id] && state == 2) {
      let p = playerList[socket.id];
      p.count++;

      if (p.count >= CLICK_GOAL) {
        p.finished = true;
        p.time = Date.now() - startTime;
      }
      io.emit("playerListUpdated", playerList);
      checkEnd();
    }
  });

  socket.on("disconnect", () => {
    delete playerList[socket.id];
    io.emit("playerListUpdated", playerList);
    checkEnd();
    if (!Object.keys(playerList).length) {
      state = 0;
    }
  });

  function checkEnd() {
    if (Object.values(playerList).every((obj) => obj.count >= CLICK_GOAL)) {
      state = 3;
      io.emit("stateUpdated", state);
    }
  }
});

app.use(express.static("public"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
