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

  socket.emit('newEmail', {
    from: 'Dropfire',
    text: 'With the best, Dropfire',
    createdAt: Date.now(),
  });

  socket.on('createEmail', (newEmail) => {
    console.log(newEmail);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
