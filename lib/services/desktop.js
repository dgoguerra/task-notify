var notifier = require('node-notifier');

function Notifier(config) {
    this.config = config;
}

Notifier.prototype.textNotification = function(title, content) {
    notifier.notify({
        title: title,
        message: content
    }, function(err, response) {
        if (err) throw err;
    });
};

module.exports = Notifier;
