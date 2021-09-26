const socket = io();

function scrollToBottom() {
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  console.log('Connected to server');

  const params = jQuery.deparam(window.location.search);
  params.room = params.room.toLowerCase();

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No errors.');
    }
  });

  socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime,
    });

    jQuery('#messages').append(html);

    scrollToBottom();

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

  scrollToBottom();
});

socket.on('updateUserList', function (users) {
  const ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
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
