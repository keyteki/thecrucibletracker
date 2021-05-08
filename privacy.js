const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
});

const playersToTrack = {
  z_legweak: false,
  TheRaneeIsEvil: false,
};

const identifyPlayersToTrack = async () => {
  try {
    const query = 'SELECT name FROM players';
    const queryResult = await pool.query(query);
    queryResult.rows.forEach(({ name }) => {
      trackPlayer(name);
    });
  } catch (err) {
    console.error(err);
  }
};
identifyPlayersToTrack();

const isPublic = (name) => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  return playersToTrack[name];
};

const cleanUsername = (name) => (isPublic(name) ? name : 'anonymous');

const cleanGame = (game) => {
  if (!game) return;
  if (!isPublic(game.winner)) {
    game.winner = 'anonymous';
  }
  if (!isPublic(game.loser)) {
    game.loser = 'anonymous';
  }
  return game;
};

const cleanGameTimeline = (timeline) => {
  if (!timeline || !timeline.turns) return;

  const getName = (name) => {
    if (!isPublic(name)) {
      return 'anonymous';
    }
    return name;
  };

  timeline.turns.forEach((turn) => {
    turn.player = getName(turn.player);
    turn.activePlayer = getName(turn.activePlayer);
  });

  return timeline;
};

const cleanEvents = (events) => {
  if (!events) return;

  const playersMadeAnonymous = {};

  const getName = (name) => {
    if (!isPublic(name)) {
      playersMadeAnonymous[name] = true;
      return 'anonymous';
    }
    return name;
  };

  events.forEach((event) => {
    if (Array.isArray(event.message)) {
      // special case for amber status messages
      if (/: \d+ amber .*: \d+ amber/.test(event.message[0])) {
        let line = event.message[0]
          .replace(new RegExp(' \\(0 keys\\)'), '')
          .replace(new RegExp(' \\(1 key\\)'), '')
          .replace(new RegExp(' \\(2 keys\\)'), '')
          .replace(new RegExp(' \\(3 keys\\)'), '');
        line = line
          .replace(new RegExp(' \\(0 keys\\)'), '')
          .replace(new RegExp(' \\(1 key\\)'), '')
          .replace(new RegExp(' \\(2 keys\\)'), '')
          .replace(new RegExp(' \\(3 keys\\)'), '');
        const [ match, playerA, playerB ] = line.match(/(.*): \d+ amber (.*): \d+ amber/);

        if (!isPublic(playerA)) {
          event.message[0] = event.message[0].replace(playerA, 'anonymous');
        }
        if (!isPublic(playerB)) {
          event.message[0] = event.message[0].replace(playerB, 'anonymous');
        }
      }

      cleanEvents(event.message);
    } else if (event.message && event.message.alert) {
      cleanEvents(event.message.alert.message);
    } else if (event.players) {

    } else if (event.argType === 'nonAvatarPlayer') {
      event.name = getName(event.name);
    }
  });

  return events;
};

const cleanBoards = (boards) => {
  if (!boards) return;

  const clean = (obj) => {
    if (!obj) return;
    Object.keys(obj)
      .forEach((name) => {
        if (!isPublic(name)) {
          obj.anonymous = obj[name];
          delete obj[name];
        }
      });
  };

  boards.forEach((board) => {
    board.board = board.board || {};
    board.hand = board.hand || {};
    board.purged = board.purged || {};
    board.archives = board.archives || {};

    clean(board.board);
    clean(board.hand);
    clean(board.purged);
    clean(board.archives);
  });

  return boards;
};

const cleanPlayerObject = (obj) => {
  if (!isPublic(obj.player)) {
    return { ...obj, player: 'anonymous' };
  }

  return obj;
};

const trackPlayer = (name) => {
  if (isPublic(name) !== false) {
    playersToTrack[name] = true;
  }
};

module.exports = {
  cleanGame,
  cleanUsername,
  cleanGameSummary: cleanGame,
  cleanGameTimeline,
  cleanBoards,
  cleanEvents,
  cleanPlayerObject,
  trackPlayer,
  playersToTrack,
  isPublic,
};
