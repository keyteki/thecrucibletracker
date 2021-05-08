# The Crucible Tracker Parser
This module analyzes The Crucible Online game logs.

## Usage

To parse game logs

```
$ cat fixtures/cleaning-wave.json | bin/parse
{
  "winner": {
    "name:" "stronglink"
    "deckID:" "ef3196df-2d6f-4bb4-a2be-966cbaabf942",
    "deckName:" "Ze who Stomps on Goblins",
    "actionsPlayed": 14,
    "cardsDrawn:" 26,
    "aemberStolen": 4,
    ...
  },
  "loser": {
    ...
  },
  "turns": 11,
}
```

To run tests

```
yarn test
```

## The Crucible Online Data

The Crucible Online servers communicate with web clients via a WebSocket that sends two categories of informations:
1. `messages` that describe game actions.
2. A `game state` object that contains information about each players aember, keys, card pile, etc.

While a game is in progress, the TCO server maintains an array of all game `messages` that have occurred and, when the server sends new information to the client, this complete list of game messages is sent as well. Below is an example of two game messages.

```
[{
  "date": "2019-05-03T19:28:20.316Z",
  "message": [
    {
      "name": "stronglink"
    },
    " plays ",
    {
      "name": "Pingle Who Annoys",
      "type": "creature"
    }
  ]
}, {
  "date": "2019-05-03T19:28:10.476Z",
  "message": [
    {
      "name": "stronglink"
    },
    " uses ",
    {
      "name": "Gauntlet of Command",
      "type": "artifact"
    },
    " to ",
    {
      "message": [
        "ready and fight with ",
        {
          "name": "Krump",
          "type": "creature"
        }
      ]
    }
  ]
}]
```

Because all game messages are sent with each server request, the Crucible Tracker extension is able to capture the entire history of a game even if the extension did not witness these actions. Why does this matter? This fact matters because `game state` is not relayed this way–if our tracker does not witness game state updates this information is lost.

We are interested in the aember and keys information in the `game state`. Game messages don't always mention when aember is gained, lost, stolen, or captured, so the game state allows us to fill in the gaps. Below is an example of TCO's `game state`.

```
{
  "players": {
    "stronglink": {
      "activeHouse": null,
      "stats": {
        "amber": 0,
        "chains": 3,
        "keys": 0
      },
      "deckName": "...",
      ...
    },
    "BHawk": {
      "activeHouse": "dis",
      "stats": {
        "amber": 1,
        "chains": 0,
        "keys": 0
      },
      "deckName": "...",
      ...
    }
  }
}
```

## Data Sent to The Crucible Tracker

The Crucible Tracker extension combines game messages and game state into one array before sending this information to the Crucible Tracker servers. Before and after each message, we create `PLAYER_STATE_UPDATE` objects from the game state. Pandemonium, for example, does not signal how much aember is captured, so if we have `PLAYER_STATE_UPDATE` events before and after the Pandemonium message we can calculate how much aember was captured.

```
[{
  "date": "2019-05-03T19:28:54.514Z",
  "type": "PLAYER_STATE_UPDATE",
  "players": {
    "stronglink": {
      "amber": 2,
      "chains": 2,
      "keys": 0
    },
    "BHawk": {
      "amber": 5,
      "chains": 0,
      "keys": 0
    }
  }
},
{
  "date": "2019-05-03T19:28:54.233Z",
  "message": [
    {
      "name": "stronglink"
    },
    " uses ",
    {
      "name": "Pandemonium",
      "type": "action"
    },
    " to ",
    {
      "message": [
        "cause each undamaged creature to capture 1 amber from their opponent"
      ]
    }
  ]
},
{
  "date": "2019-05-03T19:28:54.514Z",
  "type": "PLAYER_STATE_UPDATE",
  "players": {
    "stronglink": {
      "amber": 1,
      "chains": 2,
      "keys": 0
    },
    "BHawk": {
      "amber": 1,
      "chains": 0,
      "keys": 0
    }
  }
}]
```

For each game one array containing messages and game states is persisted in the Crucible Tracker's database. We can at anytime re-run the analyzer in this repo on every game log we've stored.
