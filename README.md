task-notify
===========

`tnotify` is a utility to send notifications and pipe command outputs to different third-party services.

The goal of this project is mainly to have a useful command line tool to easily notify when a task is done or something happened through different services, and also to play with different APIs out there.

It is oriented mainly to be used from the command line, but it could also be required and used within a Node project directly.

Installation
------------

```bash
npm install -g task-notify
which tnotify # /usr/local/bin/tnotify
```

Usage
-----

The currently supported services and options they require are:

| Name | Description | Options |
| ---- | ----------- | ------- |
| `desktop` | Open a system notification in your desktop. Calls directly [node-notifier](https://github.com/mikaelbr/node-notifier). | None |
| `pushbullet` | Push notes through your [Pushbullet](https://www.pushbullet.com/) account directly to your browser or phone. | `access_token` |
| `smtp` | A SMTP client. | `host`, `port`, `secure` (boolean), `username`, `password`, `from`, `to` |
| `stdout` | For testing, outputs the content to stdout. | None |
| `twilio` | [Twilio](https://www.twilio.com/) SMS API. | `account_sid`, `auth_token`, `service_sid`, `from`, `to` |

Each service's options can be provided directly through the command line:

```bash
$ tnotify msg -s pushbullet --pushbullet-access-token=TOKEN 'Hey there!'
```

or configured beforehand:

```bash
$ tnotify config -s pushbullet
Current values of an option are shown between brackets. Leave empty to maintain the current value.
Configuring 'pushbullet' service:
Access Token []: qwerty123456
Saved into '/Users/dgo/.tnotify/config.json'

# and from now on...
$ tnotify msg -s pushbullet 'Hey there!'
```

`tnotify` has 4 different actions:

```bash
# list existing services
$ tnotify list

# configure services
$ tnotify config -s desktop,pushbullet,smtp

# run a command and send its output through the selected services:
$ tnotify run -s desktop,pushbullet,smtp -- ls -alh

# send a message directly
$ tnotify msg -s desktop,pushbullet,smtp --title='Test Notification' 'Hey there!'

# 'msg' action is assumed. the command's piped output is used as the message to send
$ echo 'Hey there!' | tnotify -s desktop,pushbullet,smtp
```

License
-------
MIT license - http://www.opensource.org/licenses/mit-license.php
