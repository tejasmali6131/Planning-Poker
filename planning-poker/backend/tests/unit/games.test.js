const testHelpers = require('../testHelpers');

describe('Games Data Store', () => {
  let games;

  beforeEach(() => {
    // Clear the games object before each test
    games = require('../../data/games');
    // Clear all games
    Object.keys(games).forEach(key => delete games[key]);
  });

  describe('Module Export', () => {
    test('should export an object', () => {
      expect(typeof games).toBe('object');
      expect(games).not.toBeNull();
    });

    test('should export the same reference when required multiple times', () => {
      const games1 = require('../../data/games');
      const games2 = require('../../data/games');
      expect(games1).toBe(games2);
    });
  });

  describe('Basic Operations', () => {
    test('should start as empty and allow CRUD operations', () => {
      expect(Object.keys(games).length).toBe(0);

      // Create
      const gameId = 'test123';
      const gameData = testHelpers.createTestGame({
        creator: 'testUser',
        started: false
      });
      games[gameId] = gameData;

      // Read
      expect(games[gameId]).toBeDefined();
      expect(games[gameId].creator).toBe('testUser');
      expect(games[gameId].started).toBe(false);

      // Update
      games[gameId].started = true;
      expect(games[gameId].started).toBe(true);

      // Delete
      delete games[gameId];
      expect(games[gameId]).toBeUndefined();
    });

    test('should handle multiple games', () => {
      const game1 = testHelpers.createTestGame({ creator: 'user1' });
      const game2 = testHelpers.createTestGame({ creator: 'user2' });

      games['game1'] = game1;
      games['game2'] = game2;

      expect(Object.keys(games).length).toBe(2);
      expect(games['game1'].creator).toBe('user1');
      expect(games['game2'].creator).toBe('user2');
    });
  });

  describe('Game State Management', () => {
    test('should store complete game state', () => {
      const gameId = 'test123';
      const gameData = {
        players: [
          testHelpers.createTestPlayer({ username: 'player1', id: 'socket1' }),
          testHelpers.createTestPlayer({ username: 'player2', id: 'socket2' })
        ],
        started: true,
        creator: 'player1',
        revealed: false,
        currentTopic: 'Test Story'
      };

      games[gameId] = gameData;

      expect(games[gameId].players.length).toBe(2);
      expect(games[gameId].started).toBe(true);
      expect(games[gameId].creator).toBe('player1');
      expect(games[gameId].revealed).toBe(false);
      expect(games[gameId].currentTopic).toBe('Test Story');
    });

    test('should handle game state updates', () => {
      const gameId = 'test123';
      games[gameId] = testHelpers.createTestGame();

      // Start the game
      games[gameId].started = true;
      expect(games[gameId].started).toBe(true);

      // Add a player
      games[gameId].players.push(testHelpers.createTestPlayer());
      expect(games[gameId].players.length).toBe(1);

      // Reveal cards
      games[gameId].revealed = true;
      expect(games[gameId].revealed).toBe(true);
    });
  });

  describe('Player Management', () => {
    test('should handle player operations', () => {
      const gameId = 'test123';
      games[gameId] = testHelpers.createTestGame();

      // Add players
      const player1 = testHelpers.createTestPlayer({ username: 'player1' });
      const player2 = testHelpers.createTestPlayer({ username: 'player2' });
      games[gameId].players.push(player1, player2);

      expect(games[gameId].players.length).toBe(2);
      testHelpers.expectGameToHavePlayer(games[gameId], 'player1');
      testHelpers.expectGameToHavePlayer(games[gameId], 'player2');

      // Update player vote
      const playerRef = games[gameId].players.find(p => p.username === 'player1');
      playerRef.vote = 8;
      expect(games[gameId].players[0].vote).toBe(8);

      // Remove player
      games[gameId].players = games[gameId].players.filter(p => p.username !== 'player1');
      expect(games[gameId].players.length).toBe(1);
      testHelpers.expectGameNotToHavePlayer(games[gameId], 'player1');
      testHelpers.expectGameToHavePlayer(games[gameId], 'player2');
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined game access', () => {
      expect(games['nonexistent']).toBeUndefined();
    });

    test('should handle null values', () => {
      games['test'] = null;
      expect(games['test']).toBeNull();
    });
  });
});
