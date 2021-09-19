const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  socket.on('newMessage', (message) => {
    console.log('newMessage', message);
  });

  socket.on('join', () => {
    console.log('New User joined index');
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
