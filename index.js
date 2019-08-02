var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var lobbyManager = require("./src/lobbyManager");
var logger = require("./src/nlogger");
var User = require("./src/user");
var consts = require("./src/consts");
var utils = require("./src/utils");

logger.log(`Inactivity Timer is : ${consts.TIME_OUT / 1000} seconds`);

//just in case needed later
app.get("*", (req, res) => {
  res.send("<h1>:)</h1>");
});

io.on("connection", socket => {
  socket.on("join", username => {
    const { value, valid } = utils.validate(username);
    if (lobbyManager.hasUser(value) || !valid) {
      socket.emit("conflict", valid);
    } else {
      lobbyManager.addUser(new User(value, socket));
    }
  });
});

http.listen(process.env.PORT || 3000, function() {
  logger.log("listening on localhost:3000");
});

//graceful shutdown
function handle(signal) {
  logger.sys(` Received ${signal}. Shutting down gracefully`);
  logger.farewell();
  io.sockets.emit("shutdown");
  io.close();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
