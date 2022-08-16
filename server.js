const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var pixels = [];
var convo = [];

// function drawPixels(x, y) {
//   var obj = {
//     pixelX: x,
//     pixelY: y,
//   }
//   pixels.push(obj);
//   io.emit('pixels', pixels);
// }

function transmitMessages() {
  // send messages to all the users
  io.emit('messages', convo);

}

function drawLine(startX, startY, x, y) {
  var obj = {
    startX: startX,
    startY: startY,
    x: x,
    y: y
  }
  pixels.push(obj);
  io.emit('pixels', pixels);
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('*/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/css/styles.css');
});

io.on('connection', (socket) => {
  console.log('A user has connected.');
  io.emit('pixels', pixels);
  // when a new user enters, it will join the chat.
  transmitMessages();
  // socket.on('draw', (message) => {
  //   var pos = message.split(':'); // x+':'+y divide x y into an array [x, y]
  //   var intX = parseInt(pos[0]);
  //   var intY = parseInt(pos[1]);
  //   drawPixels(intX, intY);
  // })
  // message: startX+":"+startY+':'+x+':'+y

  socket.on('chitChat', (message) => {
    convo.push(message);
    // chatting part
    transmitMessages();
  })

  socket.on('line', (message) => {
    console.log(message);
    var pos = message.split(':'); // x+':'+y divide x y into an array [x, y]
    drawLine(pos[0], pos[1], pos[2], pos[3]);
  });
  socket.on('clear', () => {
    pixels = [];
    // send updated to the client
    io.emit('pixels', pixels);
    console.log("Rec'd");
  });
  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
});

server.listen(8000, () => {
  console.log('Listening on *:8000');
});
