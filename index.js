var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var lobbyManager = require("./src/lobbyManager");
var logger = require("./src/nlogger");
app.get("*", (req, res) => {
  res.send("<h1>:)</h1>");
});

io.on("connection", socket => {
  let _user;
  socket.on("join", username => {
    if (lobbyManager.hasUser(username)) {
      socket.emit("conflict");
    } else {
      lobbyManager.addUser(username, socket.id);
      socket.emit("joined", { username });
      _user = username;
      io.sockets.emit("message", {
        type: "INFO",
        text: "JOINED",
        timestamp: new Date(),
        username
      });
    }
  });

  socket.on("message", text => {
    //Send message to everyone
    io.sockets.emit("message", {
      type: "MESSAGE",
      text: text,
      timestamp: new Date(),
      username: _user
    });
  });

  socket.on("leave", () => {
    io.sockets.emit("message", {
      type: "INFO",
      text: "LEFT",
      timestamp: new Date(),
      username: _user
    });
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    lobbyManager.removeUser(_user);
  });
});

http.listen(3000, function() {
  logger.log("listening on localhost:3000");
});

function handle(signal) {
  logger.log(` Received ${signal}. \n Shutting down gracefully`);
  io.close();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
