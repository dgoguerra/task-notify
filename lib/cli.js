#!/usr/bin/env node

var _ = require('lodash'),
    argv = require('optimist').argv,
    fs = require('fs'),
    tmp = require('tmp'),
    child_process = require('child_process'),
    notify = require('./notify.js');

function printUsage() {
    console.log('usage: notify --list');
    console.log('       notify --services=LIST [options] [--title=TITLE]');
}

function printProviders() {
    notify.getProviderNames().forEach(function(name) {
        console.log(name);
    });
}

function getProviderOptions(providerName) {
    var prefix = providerName+'-',
        jsonKey = prefix+'json',
        opts = argv[jsonKey] && JSON.parse(argv[jsonKey]) || {};

    _.each(argv, function(arg, key) {
        if (key.indexOf(prefix) === 0 && key !== jsonKey) {
            var optKey = _.snakeCase(key.slice(prefix.length));
            opts[optKey] = arg;
        }
    });

    return opts;
}

function readData(stream, callback) {
    var buffs = [];

    stream.on('data', function(buff) {
        buffs.push(buff);
    });

    stream.on('end', function() {
        callback(buffs.join(''));
    });

    stream.resume();
}

function saveToFile(stream, callback) {
    tmp.tmpName(function(err, path) {
        if (err) throw err;

        var writable = fs.createWriteStream(path);

        stream.on('end', function() {
            callback(path);
        });
        stream.pipe(writable);
    });
}

function processCmdStream(stream) {
    var title = argv.title || argv._.join(' ');

    if (argv.file === true) {
        saveToFile(stream, function(path) {
            /* TODO maybe its better to work with the stream directly,
             * instead of letting every provider to open it on its own? */
            notify.fileNotification(title, path);
        });
    }
    else {
        readData(stream, function(content) {
            notify.textNotification(title, content);
        });
    }
}

// no arguments, print usage message and exit
if (process.argv.length === 2) {
    printUsage();
    return;
}

// list existing providers and exit
if (argv.list === true) {
    printProviders();
    return;
}

_.each(argv.services.split(','), function(prov) {
    notify.load(prov, getProviderOptions(prov));
});

if (process.stdin.isTTY) {
    var cmd = argv._[0],
        cmdArgs = _.clone(argv._).splice(1);

    var proc = child_process.spawn(cmd, cmdArgs);

    processCmdStream(proc.stdout);
}
else {
    processCmdStream(process.stdin);
}
