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
    getServicesNames: function() {
        var names = _.map(services, function(serv, key) {
            return key;
        });
        return _.sortBy(names, function(n) { return n; });
    },
    load: function(name, config) {
        if (!exists(name)) {
            throw new Error("unknown service '"+name+"'");
        }
        notifiers[name] = services[name](config);
    },
    getConfig: function(name) {
        if (!exists(name)) {
            throw new Error("unknown service '"+name+"'");
        }
        return services[name].config || {};
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
