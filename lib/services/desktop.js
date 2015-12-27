var notifier = require('node-notifier');

module.exports = function(config) {
    return {
        textNotification: function(title, content) {
            notifier.notify({
                title: title,
                message: content
            }, function(err, response) {
                if (err) throw err;
            });
        }
    };
};

module.exports.description = 'System notifications in your desktop.';
