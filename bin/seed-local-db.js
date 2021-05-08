const fs = require('fs');
const { Client } = require('pg');
const games = require('../fixtures/games');
const events = require('../fixtures/game-events');
const startingHands = require('../fixtures/starting-hands');
const boardStates = require('../fixtures/board-states');

const connectionString = 'postgres://postgres:postgres@127.0.0.1:3005/postgres';

const main = async () => {
  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    const client = new Client({
      connectionString,
    });
    await client.connect();

    const query = 'INSERT INTO games VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)';
    const queryResponse = await client.query(query, [
      game.id,
      game.winner,
      game.loser,
      game.turns,
      game.winner_deck_id,
      game.winner_deck_name,
      game.winner_keys,
      game.winner_checks,
      game.loser_deck_id,
      game.loser_deck_name,
      game.loser_keys,
      game.loser_checks,
      game.date,
      game.crucible_game_id,
      false,
      false,
      game.winner_deck_expansion,
      game.loser_deck_expansion
    ]);
    await client.end();
    console.log(`Game ${game.id} uploaded`);
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    const client = new Client({
      connectionString,
    });
    await client.connect();

    const query = 'INSERT INTO events VALUES ($1, $2, $3)';
    const queryResponse = await client.query(query, [
      event.id,
      event.game_id,
      JSON.stringify(event.events),
    ]);
    await client.end();
    console.log(`Event ${event.id} uploaded`);
  }

  for (let i = 0; i < startingHands.length; i++) {
    const startingHand = startingHands[i];

    const client = new Client({
      connectionString,
    });
    await client.connect();

    const query = 'INSERT INTO starting_hands VALUES ($1, $2, $3)';
    const queryResponse = await client.query(query, [
      startingHand.id,
      startingHand.crucible_game_id,
      JSON.stringify(startingHand.hands),
    ]);
    await client.end();
    console.log(`Hand ${startingHand.id} uploaded`);
  }

  for (let i = 0; i < boardStates.length; i++) {
    const boardState = boardStates[i];

    const client = new Client({
      connectionString,
    });
    await client.connect();

    const query = 'INSERT INTO board_states VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const queryResponse = await client.query(query, [
      boardState.id,
      boardState.crucible_game_id,
      boardState.turn,
      JSON.stringify(boardState.board),
      JSON.stringify(boardState.hand),
      JSON.stringify(boardState.archives),
      JSON.stringify(boardState.purged),
    ]);
    await client.end();
    console.log(`Board state ${boardState.id} uploaded`);
  }
};

main();
