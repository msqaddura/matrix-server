var lobbyManager = require("./lobbyManager");
var utils = require("./utils");
var logger = require("./nlogger");
const TIME_OUT = require("./consts").TIME_OUT;
/**
 * user handles the socket as he knows when to timed out
 */

class User {
  constructor(username, socket) {
    this.username = username;
    this.socket = socket;
    this.timer = null;
    this.wasKicked = false; //timedout
    this.consent = false; //he left
    this.hello();
    this.listen();
    this.refreshTimeout();
  }

  //on every messagae reset the timeout timer
  refreshTimeout() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(
      this.onTimeOut.bind(this),
      this.username === "easter_egg" ? 100000 : TIME_OUT
    );
  }

  //user was inactive for the allowed time
  onTimeOut() {
    this.wasKicked = true;
    this.socket.emit("timeout");
    this.broacastAll("message", {
      type: "INFO",
      text: "kicked due to inactivity",
      timestamp: new Date(),
      username: this.username
    });
    this.socket.disconnect();
  }

  //inform the room that user joined
  hello() {
    const username = this.username;
    this.socket.emit("joined", { username });
    this.broacastAll("message", {
      type: "INFO",
      text: "joined",
      timestamp: new Date(),
      username
    });
  }

  //start listening to the socket
  listen() {
    const username = this.username;
    this.socket
      .on("message", text => {
        const value = utils.sanitize(text);
        //dont allow spaces
        if (value.length > 0) {
          this.refreshTimeout();
          //dont overkill the log with the mesage value or add verbosity level;
          logger.log(`User : *${username}* sent message ####`);
          this.broacastAll("message", {
            type: "MESSAGE",
            text: value,
            timestamp: new Date(),
            username
          });
        }
      })
      .on("leave", () => {
        this.consent = true;
        this.broacastAll("message", {
          type: "INFO",
          text: "left",
          timestamp: new Date(),
          username
        });
        this.socket.disconnect();
      })
      .on("disconnect", () => {
        if (!this.consent)
          this.socket.broadcast.emit("message", {
            type: "INFO",
            text: "lost connection",
            timestamp: new Date(),
            username: this.username
          });
        this.destory();
      });
  }

  //avoid memory leaks
  destory() {
    lobbyManager.removeUser(this.username, this.wasKicked, this.consent);
    clearTimeout(this.timer);
    this.socket.removeAllListeners();
    this.socket = null;
  }

  // send to everyone inclusive
  broacastAll(header, payload) {
    this.socket.broadcast.emit(header, payload);
    this.socket.emit(header, payload);
  }
}

module.exports = User;
