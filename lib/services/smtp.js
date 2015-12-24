var nodemailer = require('nodemailer');

module.exports = function(config) {
    var transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        auth: {
            user: config.username,
            pass: config.password
        }
    });

    return {
        textNotification: function(title, content) {
            var mailOptions = {
                from: config.from,
                to: config.to,
                subject: title,
                text: content
                //html: '<b>Hello world</b>'
            };

            transport.sendMail(mailOptions, function(err, info) {
                if (err) throw err;
                //console.log('Message sent: ' + info.response);
            });
        }
    };
};
