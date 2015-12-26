var notify = require('task-notify');

notify.load('pushbullet', {
    access_token: 'YOUR_PUSHBULLET_TOKEN'
});

notify.load('smtp', {
    host: 'mailtrap.io',
    port: 2525,
    secure: true,
    username: 'YOUR_MAILTRAP_USERNAME',
    password: 'YOUR_MAILTRAP_PASSWORD',
    from: 'sender@mail.com',
    to: 'receiver@mail.com'
});

notify.textNotification('[tnotify] Example from Tonic', 'Hey there!');
