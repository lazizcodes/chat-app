const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  socket.on('newMessage', (message) => {
    console.log('newMessage', message);
    const li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
  });

  socket.emit(
    'createMessage',
    {
      from: 'Muhridin',
      text: 'Lazz qalaysiz',
    },
    function (data) {
      console.log(data);
    }
  );
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: jQuery('[name=message]').val(),
    },
    function () {}
  );
});
