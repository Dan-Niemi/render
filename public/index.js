function clickerGame() {
  return {
    socket: null,
    id: null,
    playerName: "",
    hasName: false,
    playerList: {},
    state: 0, //0,1,2 for pre, during, and post game
    finishOrder: [],

    init() {
      this.socket = io();
      this.socket.on("idCreated", (id) => (this.id = id));
      this.socket.on("setState", (state) => (this.state = state));
      this.socket.on("updateScores", (playerList) => (this.playerList = playerList));
      this.socket.on("gameStarted", (playerList,finishOrder) => {
				this.state = 1;
				this.playerList = playerList;
				this.finishOrder = finishOrder
			});
      this.socket.on("gameEnded", () => (this.state = 2));
      this.socket.on("playerFinished", (finishOrder) => (this.finishOrder = finishOrder));
    },
    get finished() {
      return this.playerList[this.id]?.finished;
    },
    submitName() {
      if (this.playerName.trim() !== "") {
        this.hasName = true;
        this.socket.emit("newPlayer", this.playerName);
      }
    },
  
  };
}
