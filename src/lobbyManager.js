var User = require("./user");
var logger = require("./nlogger");
class LobbyManager {
  constructor() {
    this.name = "hey";
    this.users = [];
  }

  get total() {
    return this.users.length;
  }

  hasUser(username) {
    if (this.userIndex(username) === -1) return false;
    logger.log(`Existing User *${username}* tried to join!`);
    return true;
  }

  userIndex(username) {
    return this.users.findIndex(user => user.username === username);
  }
  addUser(username, socketId) {
    this.users.push(new User(username, socketId));
    logger.log(`Added User *${username}* to [${this.total}] Users`);
  }

  removeUser(username) {
    const index = this.userIndex(username);
    if (index !== -1) {
      this.users.splice(index, 1);
      logger.log(`Removed User *${username}* with [${this.total}] Users`);
    } else {
      logger.log(`Tried to remove nonexistent user : *${username}*}`);
    }
  }
}

let lobbyManager = new LobbyManager();
module.exports = lobbyManager;
