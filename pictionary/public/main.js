var pictionary = function() {
    var canvas, context;
    var socket = io();
    var isDrawing = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    canvas.on('mousedown', function(event) {
      isDrawing = true;
    });

    canvas.on('mouseup', function(event){
      isDrawing = false;
    });

    canvas.on('mousemove', function(event) {
      if(!isDrawing)
        return false;

      var offset = canvas.offset();
      var position = {x: event.pageX - offset.left,
                      y: event.pageY - offset.top};
      draw(position);
      socket.emit('newCircle', position);
    });

    var guessBox;

    var onKeyDown = function(event) {
      if (event.keyCode != 13) { // Enter
          return;
      }

      console.log(guessBox.val());
      socket.emit('newGuess', guessBox.val());
      guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    socket.on('newCircle', draw);

    socket.on('newGuess', function(guess){
      $('#playerGuess').text(guess);
    })

    socket.on('assignDrawer', function(word) {
      $('#waiting').hide();
      $('#assignedWord').show();
      $('#assignedWord').text(word);
      $('#playerGuess').show();
    });

    socket.on('startGuessing', function() {
      $('#waiting').hide();
      $('#guessInput').show();
      $('#playerGuess').show();
    });

    socket.on('stopGuessing', function() {
      $('#waiting').show();
      $('#assignedWord').hide();
      $('#guessInput').hide();
      $('#playerGuess').hide();
    });
};

$(document).ready(function() {
    pictionary();
});
