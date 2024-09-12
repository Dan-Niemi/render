const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let playerList = new Map();
let state = 0; //0,1,2,3 for pre, countdown, during, and post game
let startTime = null;
const CLICK_GOAL = 50;
const COUNTDOWN_DURATION = 5000; //in ms

io.on("connection", (socket) => {
  socket.emit("newConnection", socket.id);
  socket.emit("playerListUpdated", Object.fromEntries(playerList));
  socket.emit("stateUpdated", state);

  socket.on("newPlayer", (name) => {
    playerList.set(socket.id, { name: name, count: 0, time: null });
    io.emit("playerListUpdated", Object.fromEntries(playerList));
  });

  socket.on("resetGame", () => {
    state = 0;
    io.emit("stateUpdated", state);
    playerList.forEach((player) => {
      player.count = 0;
      player.time = null;
    });
    io.emit("playerListUpdated", Object.fromEntries(playerList));
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
    let p = playerList.get(socket.id);
    if (p) {
      p.count++;
      if (p.count >= CLICK_GOAL) {
        p.time = Date.now() - startTime;
      }
      io.emit("playerListUpdated", Object.fromEntries(playerList));
      checkEnd();
    }
  });

  socket.on("disconnect", () => {
    playerList.delete(socket.id);
    io.emit("playerListUpdated", Object.fromEntries(playerList));
    checkEnd();
    console.log(playerList.size)
    if (playerList.size === 0) {
      state = 0;
    }
  });

  function checkEnd() {
    if (Array.from(playerList.values()).every((obj) => obj.count >= CLICK_GOAL)) {
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
