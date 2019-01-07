var logger = require("./nlogger");
/**
 * Lobby to manage the users
 * dont allow duplictes
 * SINGLETON
 */
class LobbyManager {
  constructor() {
    this.name = "hey";
    this.users = [];
  }

  get total() {
    return this.users.length;
  }

  //check if user exists
  hasUser(username) {
    if (this.userIndex(username) === -1) return false;
    logger.error(`Existing User *${username}* tried to join!`);
    return true;
  }

  //find out the user index to remove
  userIndex(username) {
    return this.users.findIndex(user => user.username === username);
  }

  //add user
  addUser(user) {
    this.users.push(user);
    logger.info(`Added User *${user.username}* to [${this.total}] Users`);
  }

  //remove user
  removeUser(username, wasKicked, consent) {
    const index = this.userIndex(username);
    if (index !== -1) {
      this.users.splice(index, 1);
      logger.warn(
        `Removed User *${username}* with [${this.total}] Users ${
          wasKicked
            ? "Due to inactivity"
            : consent
            ? ""
            : "Due to connection issues"
        }`
      );
    } else {
      logger.error(`Tried to remove nonexistent user : *${username}*}`);
    }
  }
}

let lobbyManager = new LobbyManager();
module.exports = lobbyManager;
