// const Mustache = require('./libs/mustache');

const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime,
    });

    jQuery('#messages').append(html);

    // const li = jQuery('<li></li>');
    // li.text(`${message.from}: ${message.text} (${formattedTime})`);

    // jQuery('#messages').append(li);
  });
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime,
  });

  jQuery('#messages').append(html);

  // const li = jQuery('<li></li>');
  // const a = jQuery('<a target="_blank">My current location</a>');

  // li.text(`${message.from}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
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
    function () {
      jQuery('[name=message]').val('');
    }
  );
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported on your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location');

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.');
    }
  );
});
