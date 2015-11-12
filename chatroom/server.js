
var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connectedUsers = [];

io.on('connection', function(socket) {
  console.log('Client connected');

  socket.on('newUser', function(username){
    console.log('New User: ' + username);
    connectedUsers.push({ SocketID: socket.id, Username: username });
    socket.broadcast.emit('newUser', { Username: username, NumUsers: connectedUsers.length });
  });

  socket.on('message', function(message){
    console.log('Received message: ' + message.Username + ' : ' + message.Message);
    socket.broadcast.emit('message', message);
  });

  socket.on('isTyping', function(username) {
    socket.broadcast.emit('isTyping', username);
  });

  socket.on('stopTyping', function(username) {
    socket.broadcast.emit('stopTyping', username);
  });

  socket.on('disconnect', function() {
    for(var i=0; i<connectedUsers.length; ++i) {
      if(connectedUsers[i].SocketID == socket.id) {
          console.log('Disconnect: ' + connectedUsers[i].Username);
          socket.broadcast.emit('disconnectedUser', connectedUsers[i].Username);
          connectedUsers.splice(i, 1);
          break;
      }
    }
  });
});

server.listen(8080);
