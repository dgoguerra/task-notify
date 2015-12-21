task-notify
===========

```bash
$ tnotify --list
```

```bash
$ tnotify --services=pushbullet --pushbullet-access-token=TOKEN
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
