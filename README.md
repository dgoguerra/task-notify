task-notify
===========

```bash
$ tnotify --list
```

```bash
$ tnotify --services=stdout \
	--title="Test Notification" \
	echo 'Hey there!'
```

```bash
$ tnotify --services=desktop \
    --title="Test Notification" \
    echo 'Hey there!'
```

```bash
$ tnotify --services=pushbullet \
	--pushbullet-access-token=TOKEN \
	--title="Test Notification" \
	echo 'Hey there!'
```

```bash
$ tnotify --services=smtp \
    --smtp-host=mailtrap.io \
    --smtp-port=2525 \
    --smtp-secure=true \
    --smtp-username=USERNAME \
    --smtp-password=PASSWORD \
    --smtp-from=from@mail.com \
    --smtp-to=to@mail.com \
    --title="Test Notification" \
    echo 'Hey there!'
```

```bash
$ tnotify --services=twilio \
    --twilio-account-sid=ACCOUNT_SID \
    --twilio-auth-token=TOKEN \
    --twilio-from=PHONE_NUMBER \
    --twilio-to=PHONE_NUMBER \
    --title="Test Notification" \
    echo 'Hey there!'

$ tnotify --services=twilio \
    --twilio-account-sid=ACCOUNT_SID \
    --twilio-auth-token=TOKEN \
    --twilio-service-sid=MESS_SERVICE_SID \
    --twilio-to=PHONE_NUMBER \
    --title="Test Notification" \
    echo 'Hey there!'
```
