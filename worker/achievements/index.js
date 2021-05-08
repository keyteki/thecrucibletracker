const REDIS_CONNECTION_STRING = process.env.REDIS_URL;

const Queue = require('bull');
const formatCardName = require('../../formatCardName');
const parseEvents = require('../../event-parser');
const scripts = require('./achievement-scripts');

const queue = new Queue('analyze games for achievements', REDIS_CONNECTION_STRING);

const fetchGameData = async (client, gameID) => {
  const query = `
    SELECT
      games.id,
      games.crucible_game_id,
      games.date,
      games.turns,
      games.winner,
      games.winner_deck_id,
      games.winner_deck_name,
      games.winner_keys,
      games.winner_checks,
      games.loser,
      games.loser_deck_id,
      games.loser_deck_name,
      games.loser_keys,
      games.loser_checks,
      games.winner_deck_expansion,
      games.loser_deck_expansion,
      events.events
    FROM games
    LEFT OUTER JOIN events ON (games.id = events.game_id)
    WHERE games.id = $1
  `;

  const response = await client.query(query, [ gameID, ]);

  if (response.rows.length === 0) return;
  const data = response.rows[0];

  if (!data.events) return;

  try {
    return Object.assign(data, {
      summary: parseEvents(data.events)
    });
  } catch (e) {
    console.log('[achivements] error');
    console.log(e);
    console.log(data);
  }
};

const gamesQueued = {};
const queueNextGame = async (dbPool) => {
  const query = `
    SELECT id
    FROM games
    WHERE scanned_for_achievements IS NOT TRUE AND achievements_hit_error IS FALSE
    LIMIT 1;
  `;

  const client = await dbPool.connect();
  const response = await client.query(query);
  await client.release();

  if (!response.rows.length) {
    return;
  }

  const gameIDs = response.rows.map((g) => g.id).filter((id) => !!id);

  if (gameIDs[0]) {
    if (gamesQueued[gameIDs[0]]) {
      console.log(`[achievements] [warning] Attempted to queue ${gameIDs[0]} again`);
      return;
    }
    gamesQueued[gameIDs[0]] = true;

    queue.add({
      gameID: gameIDs[0]
    }, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
};

const fillQueue = async (dbPool) => {
  queueNextGame(dbPool);
};

const fetchUnawardedAchievements = async (client, player) => {
  const query = `
    SELECT
      name,
      player,
      progress
    FROM achievements
    WHERE player = $1 AND date_awarded_on IS NULL
  `;

  const response = await client.query(query, [ player ]);
  return response.rows;
};

const createAchievementsForUser = async (client, player) => {
  let query = '';
  scripts.forEach((script) => {
    query += `
      INSERT INTO achievements (name, player)
      VALUES ('${script.id}', '${player}')
      ON CONFLICT (name, player)
      DO NOTHING;
    `;
  });

  await client.query(query);
};

const getScriptForAchievement = (id) => scripts.find((script) => script.id === id);

const setAchivementProgress = async (client, name, player, progress) => {
  const query = `
    UPDATE achievements
    SET
      progress = $1
    WHERE
      name = $2 AND player = $3;
  `;

  await client.query(query, [ progress, name, player ]);
};

const awardAchievement = async (client, name, player, crucibleGameId, date) => {
  const query = `
    UPDATE achievements
    SET
      date_awarded_on = $1,
      game_awarded_in_crucible_game_id = $2
    WHERE
      name = $3 AND player = $4;
  `;

  await client.query(query, [ date, crucibleGameId, name, player ]);
};

const consume = async (dbPool) => {
  const jobCounts = await queue.getJobCounts();
  console.log('[achievements] Job counts', jobCounts);

  queue.clean(10000, 'completed');
  queue.on('cleaned', (jobs, type) => {
    console.log('[achievements] Cleaned %s %s jobs', jobs.length, type);
  });

  queue.process(async (job, done) => {
    const { gameID } = job.data;
    const client = await dbPool.connect();

    if (!gameID) {
      console.log(`[achievements] Analyzing game with undefined id ${gameID}`, job.data);
    }

    const gameData = await fetchGameData(dbPool, gameID);
    if (!gameData) {
      console.log(`[achievements] Skipping achievements for game ${gameID}`);

      const query = `
        UPDATE games
        SET
          scanned_for_achievements = FALSE,
          achievements_hit_error = TRUE
        WHERE id = $1;
      `;

      const response = await client.query(query, [ gameID ]);

      await client.release();
      await queueNextGame(dbPool);
      done();
      return;
    }

    const results = [ 'winner', 'loser' ];

    for (let j = 0; j < 2; j++) {
      const result = results[j];
      const player = gameData[result];

      const unawardedAchievements = await fetchUnawardedAchievements(client, player);

      if (!unawardedAchievements.length) {
        await createAchievementsForUser(client, player);
      }

      for (let i = 0; i < unawardedAchievements.length; i++) {
        const script = getScriptForAchievement(unawardedAchievements[i].name);

        try {
          const scriptOutput = script.check({
            player,
            game: gameData,
            summary: gameData.summary,
            events: gameData.events,
            progress: unawardedAchievements[i].progress || script.defaultProgress || 0,
          });

          if (scriptOutput === true || (scriptOutput && scriptOutput.awarded)) {
            const crucibleGameId = scriptOutput.progress ? '' : gameData.crucible_game_id;
            await awardAchievement(client, script.id, player, crucibleGameId, gameData.date);
          }

          if (scriptOutput && scriptOutput.progress) {
            await setAchivementProgress(client, script.id, player, scriptOutput.progress);
          }
        } catch (e) {
          console.log(unawardedAchievements[i]);
          console.log(`[achievements] Script "${script.id}" threw an error ${e} for game ${gameData.id}`);

          const query = `
            UPDATE games
            SET
              scanned_for_achievements = FALSE,
              achievements_hit_error = TRUE
            WHERE id = $1;
          `;

          const response = await client.query(query, [ gameID ]);

          await client.release();
          await queueNextGame(dbPool);
          done();
          return;
        }
      }
    }

    const query = `
      UPDATE games
      SET scanned_for_achievements = TRUE
      WHERE id = $1;
    `;

    const response = await client.query(query, [ gameID ]);

    await client.release();
    await queueNextGame(dbPool);
    done();
  });
};

module.exports = {
  consume,
  fillQueue,
};
