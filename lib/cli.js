#!/usr/bin/env node

var _ = require('lodash'),
    debug = require('debug')('cli'),
    sprintf = require('sprintf-js').sprintf,
    read = require('read'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path'),
    tmp = require('tmp'),
    child_process = require('child_process'),
    notify = require('./notify.js');

var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        services: ['service', 's'],
        title: 't',
        quiet: 'q'
    }
});

function printUsage() {
    console.log('usage: tnotify msg --services=LIST [--title=TITLE] [options] -- MESSAGE');
    console.log('       tnotify run --services=LIST [--title=TITLE] [options] -- COMMAND');
    console.log('       tnotify config --services=LIST');
    console.log('       tnotify list');
}

/* obtain the list of services to use given in the command arguments.
 * The --services option can either be user several times or contain
 * a comma separated list of service names. */
function getServices(argv) {
    if (!argv.services) {
        return [];
    }

    var services = argv.services,
        splitted = [];

    if (!_.isArray(services))
        services = [ services ];

    _.each(services, function(names) {
        _.each(names.split(','), function(servName) {
            splitted.push(servName);
        });
    });

    return splitted;
}

function getServiceOptions(argv, servName) {
    var config = notify.getConfig(servName),
        prefix = servName+'-',
        opts = {};

    /* special optional key to load all the options of a service
     * at once as a json object.
     * They will be supplied in camel case, the same way they
     * are used inside the service.
     * eg: --pushbullet-json='{"access_token":"TOKEN"}'
     */
    var jsonKey = prefix+'json';
    if (argv[jsonKey]) {
        opts = JSON.parse(argv[jsonKey]) || {};
    }

    /* iterate over the expected options of the service and save
     * them if they are found in the command args.
     * they will be supplied in kebab case with the service name
     * as a prefix.
     * eg: --pushbullet-access-token=TOKEN
     */
    _.each(_.keys(config), function(key) {
        var optName = prefix+_.kebabCase(key);
        if (argv[optName]) {
            opts[key] = argv[optName];
        }
    });

    return opts;
}

function readStreamData(stream, callback) {
    var buffs = [];

    stream.on('data', function(buff) {
        buffs.push(buff);
    });

    stream.on('end', function() {
        callback(buffs.join(''));
    });

    stream.resume();
}

/* TODO saving into a file not in use yet.
 *
 * usage:
 * saveToFile(stream, function(path) {
 *   // TODO maybe its better to work with the stream directly,
 *   // instead of letting every service to open it on its own?
 *   notify.fileNotification(title, path);
 * });
 */
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

function getUserConfig() {
    var home = process.env.HOME || process.env.USERPROFILE,
        configPath = path.join(home, '.tnotify/config.json'),
        configData = {};

    try {
        var content = fs.readFileSync(configPath);
        configData = JSON.parse(content) || {};
    } catch (e) {

    }

    // use a 'default' profile, in case in the future different profiles
    // can be saved and loaded.
    return configData.profiles && configData.profiles.default || {};
}

function saveUserConfig(userConfig) {
    var home = process.env.HOME || process.env.USERPROFILE,
        configPath = path.join(home, '.tnotify/config.json');

    // schema to use if the file didn't exist yet
    var configData = {
        // add a file version, in case in the future there are breaking changes in it
        fileVersion: '0.1.0',
        profiles: {
            default: {}
        }
    };

    // try to load the existing config file
    try {
        var content = fs.readFileSync(configPath);
        configData = JSON.parse(content) || {};
    } catch (e) {

    }

    configData.profiles.default = userConfig;

    mkdirp(path.dirname(configPath), function(err) {
        if (err) throw err;

        var data = JSON.stringify(configData, null, '  ');
        fs.writeFile(configPath, data, 'utf8', function(err) {
            if (err) throw err;
            console.log('Saved into \'%s\'', configPath);
        });
    });
}


// no arguments, print usage message and exit
if (process.argv.length === 2) {
    printUsage();
    process.exit();
}

var action = argv._[0],
    actionArgs = _.clone(argv._).slice(1),
    services = getServices(argv);

if (!action || action === 'msg' || action === 'run') {
    var config = getUserConfig();

    if (services.length === 0) {
        console.error('error: select which services to configure with --services=LIST. '
            + 'You can list the available services with `tnotify list`.');
        process.exit(1);
    }

    // load the services to use
    _.each(services, function(servName) {
        if (!notify.exists(servName)) {
            console.error('error: unknown service \'%s\', aborting. '
                + 'You can list the available services with `tnotify list`.', servName);
            process.exit(1);
        }

        var servConfig = _.extend({},
            // options saved while configuring the service
            config.services && config.services[servName] || {},
            // options given as command arguments
            getServiceOptions(argv, servName)
        );
        if (debug.enabled) {
            var stringified = JSON.stringify(servConfig);
            debug('loading \'%s\' with config: %s', servName, stringified);
        }
        notify.load(servName, servConfig);
    });

    // the command whose output to save is given as an argument to
    // tnofity, run it and capture its output
    if (action === 'run') {
        if (actionArgs.length === 0) {
            console.error('error: missing command to run, aborting.');
            process.exit(1);
        }

        var title = argv.title || actionArgs.join(' '),
            cmd = actionArgs[0],
            cmdArgs = actionArgs.splice(1);

        var proc = child_process.spawn(cmd, cmdArgs);

        readStreamData(proc.stdout, function(content) {
            notify.textNotification(title, content);
        });
    }
    // the command whose output we want to capture is either
    // piped into tnotify, or provided as the rest of the arguments.
    else {
        var title = argv.title || ('[tnotify message] '+new Date().toISOString());

        /* message comes in the arguments, just send it.
         *
         * strange use case, but if there are both piped content and a non-empty
         * message in the arguments, the piped content takes preference.
         */
        if (action === 'msg' && process.stdin.isTTY && actionArgs.join(' ') !== '') {
            notify.textNotification(title, actionArgs.join(' '));
        }
        // assume command was piped into tnotify, capture its output
        else {
            // nothing is piped into tnotify, show a warning to the user just in case.
            // if its annoying it can be hidden with --quiet
            if (!argv.quiet && process.stdin.isTTY) {
                console.error('warning: listening to stdin');
            }

            readStreamData(process.stdin, function(content) {
                notify.textNotification(title, content);
            });
        }
    }
}
else if (action === 'list') {
    // list existing services and exit
    notify.getServicesNames().forEach(function(name) {
        console.log(name);
    });
    process.exit();
}
else if (action === 'config') {
    var config = getUserConfig();

    // show existing saved config and exit
    if (actionArgs.length && actionArgs[0] === 'list') {
        console.log(JSON.stringify(config, null, '  '));
        process.exit();
    }

    if (services.length === 0) {
        console.error('error: select which services to configure with --services=LIST. '
            + 'You can list the available services with `tnotify list`.');
        process.exit(1);
    }

    var queue = [];

    function runQueue(queue) {
        var func = queue.shift();
        func && func(function() {
            runQueue(queue);
        });
    }

    // configure one or more services options

    queue.push(function(next) {
        console.log('Current values of an option are shown between brackets. '
            + 'Leave empty to maintain the current value.');
        console.log();
        next();
    });

    // first make sure all services can be found
    _.each(services, function(servName) {
        if (!notify.exists(servName)) {
            console.error('error: unknown service \'%s\', aborting. '
                + 'You can list the available services with `tnotify list`.', servName);
            process.exit(1);
        }
    });

    _.each(services, function(servName) {
        var servConfig = notify.getConfig(servName);

        queue.push(function(next) {
            console.log('Configuring \'%s\' service:', servName);
            next();
        });

        if (_.isEmpty(servConfig)) {
            queue.push(function(next) {
                console.log('Nothing to configure.');
                next();
            });
            return;
        }

        _.each(servConfig, function(description, varName) {
            queue.push(function(next) {
                // the default value is the previously existing one, if any
                var defaultVal = config.services
                    && config.services[servName]
                    && config.services[servName][varName] || '';

                var readOpts = {
                    prompt: sprintf('%s [%s]: ', description, defaultVal)
                };

                read(readOpts, function(err, line) {
                    // input cancelled, nothing is saved.
                    // exit without running the rest of the queue.
                    if (err) {
                        process.exit(1);
                    }

                    if (!config.services)
                        config.services = {};

                    if (!config.services[servName])
                        config.services[servName] = {};

                    var value = line || defaultVal;

                    // if boolean, convert to a boolean
                    if (/^true|false$/.test(value)) {
                        value = (value === 'true');
                    }

                    // if numeric, convert to a number
                    if (value !== '' && /^\d*\.?\d*$/.test(value)) {
                        value = Number(value);
                    }

                    config.services[servName][varName] = value;
                    next();
                });
            });
        });
    });

    queue.push(function(next) {
        saveUserConfig(config);
        next();
    });

    runQueue(queue);
}
else {
    console.log('error: unknown action \'%s\', aborting.', action);
}
