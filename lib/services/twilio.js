var twilio = require('twilio');

module.exports = function(config) {
    var client = twilio(config.account_sid, config.auth_token);

    return {
        textNotification: function(title, content) {
            var msgConfig = {
                to: config.to,
                body: title && (title+'\n'+content) || content
            };

            if (config.service_sid) {
                msgConfig.messagingServiceSid = config.service_sid;
            }

            if (config.from) {
                msgConfig.from = config.from;
            }

            client.messages.create(msgConfig, function(err, message) {
                if (err) throw err;
            });
        }
    };
};
