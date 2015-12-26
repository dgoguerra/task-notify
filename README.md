task-notify
===========

```bash
$ tnotify list
```

Test service (prints to stdout):

```bash
$ tnotify run --services=stdout --title="Test Notification" echo 'Hey there!'
```

Several services at once:

```bash
$ tnotify run --services=stdout,desktop echo 'Hey there!'
```

Different kinds of commands:

```bash
$ tnotify run --services=stdout echo 'Hey there'
$ tnotify msg --services=stdout 'Hey there'
$ tnotify msg --services=stdout Hey there using several arguments
$ echo Hey there | tnotify --services=stdout
```

```bash
$ tnotify run --services=pushbullet \
	--pushbullet-access-token=TOKEN \
    --title="Test Notification" \
	echo 'Hey there!'
```

Other services:

```bash
$ tnotify run --services=smtp \
    --smtp-host=mailtrap.io \
    --smtp-port=2525 \
    --smtp-secure=true \
    --smtp-username=USERNAME \
    --smtp-password=PASSWORD \
    --smtp-from=from@mail.com \
    --smtp-to=to@mail.com \
    echo 'Hey there!'
```

```bash
$ tnotify run --services=twilio \
    --twilio-account-sid=ACCOUNT_SID \
    --twilio-auth-token=TOKEN \
    --twilio-from=PHONE_NUMBER \
    --twilio-to=PHONE_NUMBER \
    echo 'Hey there!'

# optionally, use --twilio-service-sid instead of --twilio-from
$ tnotify run --services=twilio \
    --twilio-account-sid=ACCOUNT_SID \
    --twilio-auth-token=TOKEN \
    --twilio-service-sid=MESS_SERVICE_SID \
    --twilio-to=PHONE_NUMBER \
    echo 'Hey there!'
```

```bash
$ tnotify config list
```

```bash
$ tnotify config --services=smtp
```
