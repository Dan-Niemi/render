function clickerGame() {
  return {
    socket: null,
    id: null,
    playerName: "",
    hasName: false,
    playerList: {},
    state: 0, //0,1,2 for pre, during, and post game
    finishOrder: [],
    startTime: null,
    time:null,
    

    init() {
      this.time = Date.now()
      this.socket = io();
      this.socket.on("newConnection", (id, playerList) => {
        this.id = id;
        this.playerList = playerList;
      });
      this.socket.on("stateUpdated", (state) => (this.state = state));
      this.socket.on("playerListUpdated", (playerList) => (this.playerList = playerList));
      this.socket.on("finishOrderUpdated",(finishOrder)=> this.finishOrder = finishOrder )
      this.socket.on("countdownStarted", (dur) => this.startTime = Date.now() + dur )
      setInterval(()=>{
        this.time = Date.now()
      },1000)
    },
    get player(){
      return this.playerList[this.id]
    },
    get players(){
      return Object.values(this.playerList)
    },
    get countdownTime(){
      if(this.startTime){
        return Math.floor((this.startTime-this.time)/1000)
      }
      return false
    },
  
    submitName() {
      if (this.playerName.trim() !== "") {
        this.hasName = true;
        this.socket.emit("newPlayer", this.playerName);
      }
    },
  };
}
