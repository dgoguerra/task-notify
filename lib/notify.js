var _ = require('lodash'),
    request = require('request'),
    services = require('./services');

var notifiers = {};

function exists(name) {
    return services[name] ? true : false;
}

function isLoaded(name) {
    return notifiers[name] ? true : false;
}

module.exports = {
    exists: exists,
    isLoaded: isLoaded,
    getService: function(name) {
        if (!exists(name)) {
            throw new Error("unknown service '"+name+"'");
        }
        return services[name];
    },
    getServices: function() {
        return services;
    },
    load: function(name, config) {
        if (!exists(name)) {
            throw new Error("unknown service '"+name+"'");
        }
        notifiers[name] = services[name](config);
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
