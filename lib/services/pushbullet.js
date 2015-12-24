var request = require('request');

module.exports = function(config) {
    var base_url = 'https://api.pushbullet.com/v2';

    var client = request.defaults({
        headers: { 'access-token': config.access_token },
        json: true
    });

    return {
        textNotification: function(title, content) {
            client.post(base_url+'/pushes', {
                body: {
                    type: 'note',
                    body: title && (title+'\n'+content) || content
                }
            }, function(err, response, body) {
                if (err) throw err;
            });
        }
    }
};
