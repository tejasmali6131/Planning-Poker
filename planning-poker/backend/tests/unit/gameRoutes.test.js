// Mock dependencies
jest.mock('../../utils/generateId');
jest.mock('../../data/games');

const express = require('express');
const request = require('supertest');
const gameRoutes = require('../../routes/gameRoutes');
const generateId = require('../../utils/generateId');
const games = require('../../data/games');

// Create test app
const app = express();
app.use(express.json());
app.use('/', gameRoutes);

describe('Game Routes', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset games mock
    Object.keys(games).forEach(key => delete games[key]);
  });

  describe('POST /create-game', () => {
    test('should create a new game successfully', async () => {
      const mockGameId = 'abc123';
      generateId.mockReturnValue(mockGameId);

      const response = await request(app)
        .post('/create-game')
        .expect(200);

      expect(response.body).toEqual({ gameId: mockGameId });
      expect(generateId).toHaveBeenCalledTimes(1);
      expect(games[mockGameId]).toEqual({
        players: [],
        status: 'waiting'
      });
    });

    test('should handle generateId errors successfully', async () => {
      generateId.mockImplementation(() => {
        throw new Error('ID generation failed');
      });

      await request(app)
        .post('/create-game')
        .expect(500);

      expect(generateId).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /game/:gameId', () => {
    test('should return game data when game exists', async () => {
      const gameId = 'existing123';
      const gameData = {
        players: [{ id: 'socket1', username: 'player1', vote: null }],
        status: 'started'
      };
      
      games[gameId] = gameData;

      const response = await request(app)
        .get(`/game/${gameId}`)
        .expect(200);

      expect(response.body).toEqual(gameData);
    });

    test('should return 404 when game does not exist', async () => {
      const nonExistentId = 'notfound';

      const response = await request(app)
        .get(`/game/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({ error: 'Game not found' });
    });
  });
});
