var nodemailer = require('nodemailer');

function SmtpMailer(config) {
    this.config = config;

    this.transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        auth: {
            user: config.username,
            pass: config.password
        }
    });
}

SmtpMailer.prototype.textNotification = function(title, content) {
    var mailOptions = {
        from: this.config.from,
        to: this.config.to,
        subject: title,
        text: content
        //html: '<b>Hello world</b>'
    };

    this.transport.sendMail(mailOptions, function(err, info) {
        if (err) throw err;
        //console.log('Message sent: ' + info.response);
    });
};

module.exports = SmtpMailer;
