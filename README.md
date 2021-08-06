![screenshot](https://github.com/granttitus/thecrucibletracker/blob/master/images/screenshot.png?raw=true)

The Crucible Tracker is a stat tracker for [thecrucible.online](https://thecrucible.online/play).

## Setup

For the first time, run:

```
bin/setup-local-development

# on console 1
yarn worker

# on console 2
yarn server

# process game summaries
node --max-old-space-size=8192 bin/seed-game-summary
```

After you setup the local environment, you can run it again using

```
docker-compose stop
docker-compose up --build -d
```

Open http://localhost:8000

## Connecting to TCO

The best approach is to integrate with TCO's backend (hook into [gameserver.js](https://github.com/keyteki/keyteki/blob/master/server/gamenode/gameserver.js)). The Crucible Tracker used a Chrome extension to pipe data out of TCO, but that was a hassle to manage.

## DB Dump - May 8, 2021

https://mega.nz/file/c0x33IaQ#KRejBNYQXjmtGMlA8dqP1G0OR-KZ1hmIbq7HzDxc988
