var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var connectedUsers = [];
var currentDrawer = null;

io.on('connection', function(socket) {
  connectedUsers.push(socket.id);
  console.log('new connection: ' + connectedUsers.length);

  if(connectedUsers.length > 1) {
    if(currentDrawer == null) {
      //assign drawer
      //tell everyone to start guessing
      socket.broadcast.emit('startGuessing', null);
      socket.emit('assignDrawer', WORDS[Math.floor(Math.random() * WORDS.length)]);
      currentDrawer = socket.id;
    }
    else {
      //tell joiner to start guessing
      socket.emit('startGuessing', null);
    }
  }

  socket.on('newCircle', function(circle){
    socket.broadcast.emit('newCircle', circle);
  });

  socket.on('newGuess', function(guess){
    socket.broadcast.emit('newGuess', guess);
  });

  socket.on('disconnect', function(){
    if(socket.id == currentDrawer) {
      currentDrawer = null;
      
      if(connectedUsers > 1)
        socket.emit('assignDrawer', WORDS[Math.floor(Math.random() * WORDS.length)]);
      else
        socket.broadcast.emit('stopGuessing', null);
    }

    for(var i=0; i<connectedUsers.length; ++i) {
      if(connectedUsers[i] === socket.id) {
        connectedUsers.splice(i, 1);
        break;
      }
    }
  });
});

server.listen(8080);
