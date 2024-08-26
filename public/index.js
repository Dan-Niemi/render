function clickerGame() {
  return {
    socket: null,
    id: null,
    playerName: "",
    hasName: false,
    playerList: {},
    state: 0, //0,1,2 for pre, during, and post game
    startTime: null,
    time:null,
    

    init() {
      this.time = Date.now()
      this.socket = io();
      this.socket.on("newConnection", (id) => {this.id = id;});
      this.socket.on("stateUpdated", (state) => (this.state = state));
      this.socket.on("playerListUpdated", (playerList) => (this.playerList = playerList));
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
    get playersSorted(){
      let tempArr = Object.values(this.playerList).slice();
      return tempArr.sort((a,b) => (a.time || 99999999) - (b.time || 99999999) != 0 ? (a.time || 99999999) - (b.time || 99999999) : b.count - a.count )
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
        this.playerName = this.playerName.trim();
        this.socket.emit("newPlayer", this.playerName);
      }
    },
  };
}
