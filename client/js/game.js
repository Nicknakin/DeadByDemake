var socket = io.connect('http://10.219.71.40:8080');

document.onkeydown = function(event){
  if(event.keyCode === 68 || event.keyCode === 39)	//d
    socket.emit('keyPress',{inputId:'right', id:socket.id});
  if(event.keyCode === 83 || event.keyCode === 40)	//s
    socket.emit('keyPress',{inputId:'down', id:socket.id});
  if(event.keyCode === 65 || event.keyCode === 37)	//a
    socket.emit('keyPress',{inputId:'left', id:socket.id});
  if(event.keyCode === 87 || event.keyCode === 38)	//w
    socket.emit('keyPress',{inputId:'up', id:socket.id});
}

function setup(){
  createCanvas(1000, 800);
  background(0);
}

socket.on('update', function(data){
  background(151);
  fill(151);
  for(i = 0; i < data.drawables.length; i++){
    renderDrawable(data.drawables[i]);
  }
});

function renderDrawable(drawable){
  if(drawable.type == 'box'){
    fill(drawable.color.r, drawable.color.g, drawable.color.b);
    rect(drawable.x-10, drawable.y-10, 20, 20);
    fill(151);
  }
}
