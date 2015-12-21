var _ = require('lodash'),
    request = require('request'),
    services = require('./services');

var notifiers = {};

module.exports = {
    getProviderNames: function() {
        var names = _.map(services, function(prov, key) {
            return key;
        });
        return _.sortBy(names, function(n) { return n; });
    },
    load: function(name, options) {
        if (! services[name]) {
            throw new Error("Unknown provider '"+name+"'");
        }
        notifiers[name] = new services[name](options);
    },
    textNotification: function(title, content) {
        _.each(notifiers, function(notif) {
            notif.textNotification(title, content);
        });
    },
    fileNotification: function(title, filepath) {
        _.each(notifiers, function(notif) {
            notif.fileNotification(title, filepath);
        });
    }
};
