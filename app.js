var express = require('express');

var app = express();
var server = app.listen(8080);

app.use(express.static('client'));

var socket = require('socket.io');

var io = socket(server);

var tickRate = 1/60;

var sockets = [];

var updateInterval = setInterval(update, 1000*tickRate, sockets);

io.sockets.on('connect', onConnect);

function onConnect(socket){
  console.log("New player!\nSocket: " + socket.id);

  //Create a character, socket id, color, direction, position, shape
  sockets.push({id:socket.id,
    color:{r: Math.floor(Math.random()*256), g: Math.floor(Math.random()*256), b: Math.floor(Math.random()*256)},
    dir:'',
    x:500,
    y:400,
    type:'box'
  });

  //Recognize keypresses (ie arrow keys)
  socket.on('keyPress',
    function(data){
      index = getPlayer(data.id);
      if((data.inputId == 'up' || data.inputId == 'down' || data.inputId == 'left' || data.inputId == 'right') && sockets.length > index)
        sockets[index].dir = data.inputId;
    }
  );

  socket.on('disconnect',
  function(){
    console.log("Disconnect! id: " + socket.id);
    sockets.splice(getPlayer(socket.id), 1);
    console.log("Number of sockets: " + sockets.length + "\n");
  });
  console.log("Number of sockets: " + sockets.length + "\n");
}

function getPlayer(id){
  for(i = 0; i < sockets.length; i++)
    if(sockets[i].id == id)
      return i;
  return -1;
}

function movePlayer(player){
    player.y += (player.dir == 'up')? -5: (player.dir == 'down')? 5: 0;
    player.x += (player.dir == 'left')? -5: (player.dir == 'right')? 5: 0;
    //player.dir = '';
}

function update(players){
  for(i = 0; i < players.length; i++){
    if(players[i].dir != '')
      movePlayer(players[i]);
  }
  io.sockets.emit('update', {drawables:players});
}
