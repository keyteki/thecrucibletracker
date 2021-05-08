![screenshot](https://github.com/granttitus/thecrucibletracker/blob/master/images/screenshot.png?raw=true)

The Crucible Tracker is a stat tracker for [thecrucible.online](https://thecrucible.online/play).

## Setup

```
bin/setup-local-development
yarn server
yarn watch
```

Open http://localhost:8000

## Connecting to TCO

The best approach is to integrate with TCO's backend (hook into [gameserver.js](https://github.com/keyteki/keyteki/blob/master/server/gamenode/gameserver.js)). The Crucible Tracker used a Chrome extension to pipe data out of TCO, but that was a hassle to manage.

## DB Dump - May 8, 2021

https://mega.nz/file/c0x33IaQ#KRejBNYQXjmtGMlA8dqP1G0OR-KZ1hmIbq7HzDxc988
