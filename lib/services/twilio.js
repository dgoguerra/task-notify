var twilio = require('twilio');

function Twilio(config) {
    this.config = config;
    this.client = twilio(config.account_sid, config.auth_token);
}

Twilio.prototype.textNotification = function(title, content) {
    var msgConfig = {
        to: this.config.to,
        body: title && (title+'\n'+content) || content
    };

    if (this.config.service_sid) {
        msgConfig.messagingServiceSid = this.config.service_sid;
    }

    if (this.config.from) {
        msgConfig.from = this.config.from;
    }

    this.client.messages.create(msgConfig, function(err, message) {
        if (err) throw err;
    });
};

module.exports = Twilio;
