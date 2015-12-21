var request = require('request');

function PushBullet(config) {
    this.base_url = 'https://api.pushbullet.com/v2';
    this.config = config;
    this.request = request.defaults({
        headers: { 'access-token': config.access_token },
        json: true
    });
}

PushBullet.prototype.textNotification = function(title, content) {
    var body = content;

    if (title) {
        body = title+'\n'+body;
    }

    this.request.post(this.base_url+'/pushes', {
        body: { type: 'note', body: body }
    }, function(err, response, body) {
        if (err) throw err;
    });
};

module.exports = PushBullet;
