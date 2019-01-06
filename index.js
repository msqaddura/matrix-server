var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("*", function(req, res) {
  res.send("<h1>:)</h1>");
});

var users = [];

io.on("connection", function(socket) {
  console.log("A user connected");
  var _user;
  socket.on("join", function(username) {
    console.log(username);

    if (users.indexOf(username) > -1) {
      console.log("no");
      socket.emit("conflict");
    } else {
      console.log("yes");
      users.push(username);
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

  socket.on("message", function(text) {
    //Send message to everyone
    io.sockets.emit("message", {
      type: "MESSAGE",
      text: text,
      timestamp: new Date(),
      username: _user
    });
  });

  socket.on("leave", function() {
    io.sockets.emit("message", {
      type: "INFO",
      text: "LEFT",
      timestamp: new Date(),
      username: _user
    });
    socket.disconnect();
  });
});

http.listen(3000, function() {
  console.log("listening on localhost:3000");
});

function handle(signal) {
  console.log(` Received ${signal}. \n Shutting down gracefully`);
  io.close();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
