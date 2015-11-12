$(document).ready(function() {
    var socket = io();
    var messages = $('#messages');
    var username = null;

    var addMessage = function(message) {
        messages.append('<div>' + message.Username + ": " + message.Message + '</div>');
    };

    var newUser = function(newUser) {
      messages.append('<div><span class="glyphicon glyphicon-plus"></span>' + newUser.Username + ' has connected</span></div>');
      messages.append('<div><span class="badge">' + newUser.NumUsers + ' Users Connected</span></div>');
    };

    var isTyping = function(username) {
      $('#typing').text(username + ' is typing...');
    };

    var stopTyping = function(username) {
      if($('#typing').text().substr(0, username.length) === username)
        $('#typing').text('');
    }

    var disconnectedUser = function(username) {
      messages.append('<div>' + username + ' has disconnected</div>');
    }

    $('#userInput').on('keydown', function(event) {
      if(event.keyCode != 13) {
        return;
      }

      username = $('#userInput').val();
      socket.emit('newUser', username);
      $('#mainPanel').scope().hasUser = true;
      $('#mainPanel').scope().$apply();
    });

    $('#messageInput').on('keydown', function(event) {
      if (event.keyCode != 13) {
          socket.emit('isTyping', username);
          return;
      }

      var message = { Username: username, Message: $('#messageInput').val() };
      addMessage(message);
      socket.emit('message', message);
      $('#messageInput').val('');
    });

    $('#messageInput').on('keyup', function(event){
      socket.emit('stopTyping', username);
    })

    socket.on('newUser', newUser);
    socket.on('isTyping', isTyping);
    socket.on('stopTyping', stopTyping);
    socket.on('message', addMessage);
    socket.on('disconnectedUser', disconnectedUser);
});

var app = angular.module('chatApp', []);

app.controller('mainCtrl',  function($scope) {
    $scope.hasUser = false;
});
