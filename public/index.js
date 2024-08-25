function clickerGame() {
  return {
    socket: null,
    id: null,
    playerName: "",
    hasName: false,
    playerList: {},
    state: 0, //0,1,2 for pre, during, and post game
    finishOrder: [],
    hasFinished: false,

    init() {
      this.socket = io();
      this.socket.on("updateScores", (playerList) => {
        this.playerList = playerList;
        if (playerList[this.socket.id]?.finished) {
          this.hasFinished = true;
        }
      });
      this.socket.on("gameStarted", () => {
        this.state = 1;
        this.hasFinished = false;
      });
      this.socket.on("gameEnded", (finishOrder) => {
        this.state = 2;
        this.finishOrder = finishOrder;
      });
      this.socket.on("newConnection", (id) => {
        this.id = id;
      });
    },

    submitName() {
      if (this.playerName.trim() !== "") {
        this.hasName = true;
        this.socket.emit("newPlayer", this.playerName);
      }
    },

    startGame() {
      this.socket.emit("startGame");
    },

    sendClick() {
      if (this.state == 1) {
        this.socket.emit("click");
      }
    },
  };
}
