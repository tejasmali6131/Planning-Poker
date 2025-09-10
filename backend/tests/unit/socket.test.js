// Mock dependencies
jest.mock('../../data/games');

const setupSocket = require('../../socket');
const games = require('../../data/games');

describe('Socket Setup', () => {
  let mockIo;
  let mockSocket;
  let joinGameHandler;
  let startGameHandler;
  let voteHandler;
  let revealHandler;
  let restartGameHandler;
  let disconnectHandler;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset games mock
    Object.keys(games).forEach(key => delete games[key]);

    // Mock socket
    mockSocket = {
      id: 'socket123',
      join: jest.fn(),
      on: jest.fn(),
      emit: jest.fn()
    };

    // Mock io
    mockIo = {
      on: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    // Setup console.log mock to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Setup socket handlers
    setupSocket(mockIo);

    // Extract handlers from mock calls
    const connectionHandler = mockIo.on.mock.calls.find(call => call[0] === 'connection')[1];
    connectionHandler(mockSocket);

    // Extract individual event handlers
    joinGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'joinGame')[1];
    startGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'startGame')[1];
    voteHandler = mockSocket.on.mock.calls.find(call => call[0] === 'vote')[1];
    revealHandler = mockSocket.on.mock.calls.find(call => call[0] === 'reveal')[1];
    restartGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'restartGame')[1];
    disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('Setup and Connection', () => {
    test('should register connection handler and socket events', () => {
      const newMockIo = { on: jest.fn() };
      setupSocket(newMockIo);
      
      expect(newMockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('joinGame', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('startGame', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('vote', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('reveal', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('restartGame', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });
  });

  describe('joinGame Handler', () => {
    test('should create new game and add player', () => {
      const gameData = { gameId: 'newGame', username: 'alice' };
      
      joinGameHandler(gameData);
      
      expect(games[gameData.gameId]).toEqual({
        players: [{ id: 'socket123', username: 'alice', vote: null }],
        started: false,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      });
      expect(mockSocket.join).toHaveBeenCalledWith('newGame');
    });

    test('should add player to existing game', () => {
      const gameId = 'existingGame';
      games[gameId] = {
        players: [{ id: 'socket1', username: 'bob', vote: null }],
        started: false,
        creator: 'bob',
        revealed: false
      };

      joinGameHandler({ gameId, username: 'alice' });
      
      expect(games[gameId].players).toHaveLength(2);
      expect(games[gameId].players[1].username).toBe('alice');
    });

    test('should handle same socket rejoining with same username (idempotent)', () => {
      const gameId = 'idempotentTest';
      games[gameId] = {
        players: [{ id: 'socket123', username: 'alice', vote: null }],
        started: false,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      joinGameHandler({ gameId, username: 'alice' });
      
      expect(games[gameId].players).toHaveLength(1);
      expect(mockSocket.emit).toHaveBeenCalledWith('joinSuccess', { gameId, username: 'alice' });
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
    });

    test('should update username for same socket with different username', () => {
      const gameId = 'updateTest';
      games[gameId] = {
        players: [{ id: 'socket123', username: 'oldname', vote: null }],
        started: false,
        creator: 'oldname',
        revealed: false,
        currentTopic: null
      };

      joinGameHandler({ gameId, username: 'newname' });
      
      expect(games[gameId].players).toHaveLength(1);
      expect(games[gameId].players[0].username).toBe('newname');
      expect(mockSocket.emit).toHaveBeenCalledWith('joinSuccess', { gameId, username: 'newname' });
    });

    test('should not add duplicate username', () => {
      const gameId = 'duplicateTest';
      games[gameId] = {
        players: [{ id: 'socket1', username: 'alice', vote: null }],
        started: false,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      joinGameHandler({ gameId, username: 'alice' });
      
      expect(games[gameId].players).toHaveLength(1);
    });
  });

  describe('startGame Handler', () => {
    test('should start game when creator requests', () => {
      const gameId = 'startTest';
      games[gameId] = {
        players: [{ id: 'socket123', username: 'alice', vote: null }],
        started: false,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      startGameHandler({ gameId, username: 'alice' });
      
      expect(games[gameId].started).toBe(true);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
    });

    test('should not start game when non-creator requests', () => {
      const gameId = 'unauthorizedStart';
      games[gameId] = {
        players: [{ id: 'socket1', username: 'alice', vote: null }],
        started: false,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      startGameHandler({ gameId, username: 'bob' });
      
      expect(games[gameId].started).toBe(false);
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });

  describe('vote Handler', () => {
    beforeEach(() => {
      const gameId = 'voteTest';
      games[gameId] = {
        players: [
          { id: 'socket123', username: 'alice', vote: null },
          { id: 'socket456', username: 'bob', vote: null }
        ],
        started: true,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };
    });

    test('should record vote and emit hidden game state', () => {
      voteHandler({ gameId: 'voteTest', username: 'alice', vote: '5' });
      
      const alicePlayer = games['voteTest'].players.find(p => p.username === 'alice');
      expect(alicePlayer.vote).toBe('5');
      
      expect(mockIo.emit).toHaveBeenCalledWith('updateGameState', {
        started: true,
        creator: 'alice',
        revealed: false,
        currentTopic: null,
        players: expect.arrayContaining([
          expect.objectContaining({
            username: 'alice',
            hasVoted: true,
            vote: null
          })
        ])
      });
    });
  });

  describe('reveal Handler', () => {
    test('should reveal votes for existing game', () => {
      const gameId = 'revealTest';
      games[gameId] = {
        players: [{ id: 'socket123', username: 'alice', vote: '5' }],
        started: true,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      revealHandler({ gameId });
      
      expect(games[gameId].revealed).toBe(true);
      expect(mockIo.to).toHaveBeenCalledWith(gameId);
    });
  });

  describe('restartGame Handler', () => {
    test('should reset game state', () => {
      const gameId = 'restartTest';
      games[gameId] = {
        players: [
          { id: 'socket1', username: 'alice', vote: '5' },
          { id: 'socket2', username: 'bob', vote: '8' }
        ],
        started: true,
        creator: 'alice',
        revealed: true,
        currentTopic: null
      };

      restartGameHandler({ gameId });
      
      expect(games[gameId].players[0].vote).toBeNull();
      expect(games[gameId].players[1].vote).toBeNull();
      expect(games[gameId].started).toBe(false);
      expect(games[gameId].revealed).toBe(false);
    });
  });

  describe('disconnect Handler', () => {
    test('should remove disconnected player from game', () => {
      const gameId = 'disconnectTest';
      games[gameId] = {
        players: [
          { id: 'socket123', username: 'alice', vote: null },
          { id: 'socket456', username: 'bob', vote: null }
        ],
        started: true,
        creator: 'alice',
        revealed: false,
        currentTopic: null
      };

      disconnectHandler();
      
      expect(games[gameId].players).toHaveLength(1);
      expect(games[gameId].players[0].username).toBe('bob');
    });

    test('should handle disconnect when player not in any game', () => {
      expect(() => disconnectHandler()).not.toThrow();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });
});
