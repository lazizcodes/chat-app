// const mongoose = require('mongoose');
const SocketManager = require('./sockets');
const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

SocketManager.init(server).listenEvents();

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = server;
