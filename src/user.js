class User {
  constructor(username, socket) {
    this.username = username;
    this.socket = socket;
    this.listen();
  }

  listen() {}
}

module.exports = User;
