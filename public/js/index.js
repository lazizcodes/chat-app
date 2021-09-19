const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('createEmail', {
    to: 'dropfiremusic@gmail.com',
    subject: 'DEMO SUBMISSION',
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newEmail', (data) => {
  console.log('New email', data);
});
