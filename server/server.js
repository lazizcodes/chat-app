const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User diconnected');
  });

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to che chat app',
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime(),
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      ...message,
      createdAt: new Date().getTime(),
    });
    // socket.broadcast.emit('newMessage', {
    //   ...message,
    //   createdAt: new Date().getTime(),
    // });
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
