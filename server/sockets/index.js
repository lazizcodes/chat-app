const { Server } = require('socket.io');
const { Users } = require('../utils/users');
const {
  generateMessage,
  generateLocationMessage,
} = require('../utils/message');
const { isRealString } = require('../utils/validation');

const users = new Users();

class SocketManager {
  init(server) {
    this.io = new Server(server);
    return this;
  }

  listenEvents() {
    this.io.on('connection', (socket) => {
      socket.on('disconnect', () => this.#disconnect(socket));
      socket.on('join', (params, callback) =>
        this.#join(params, callback, socket)
      );
      socket.on('createMessage', (message, callback) =>
        this.#createMessage(message, callback, socket)
      );
      socket.on('createLocationMessage', (coords) =>
        this.#createLocationMessage(coords, socket)
      );
    });
  }

  #disconnect(socket) {
    const user = users.removeUser(socket.id);

    if (user) {
      this.io
        .to(user.room)
        .emit('updateUserList', users.getUserList(user.room));
      this.io
        .to(user.room)
        .emit(
          'newMessage',
          generateMessage('Admin', `${user.name} left the room`)
        );
    }
  }

  #join(params, callback, socket) {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Please, enter a valid name and room name.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    this.io
      .to(params.room)
      .emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} joined the room`)
      );

    callback();
  }

  #createMessage(message, callback, socket) {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      this.io
        .to(user.room)
        .emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  }

  #createLocationMessage(coords, socket) {
    const user = users.getUser(socket.id);

    this.io
      .to(user.room)
      .emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
  }
}

module.exports = new SocketManager();
