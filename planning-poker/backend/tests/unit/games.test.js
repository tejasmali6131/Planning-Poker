const games = require('../../data/games');

describe('games data module', () => {
  beforeEach(() => {
    // Clear all games before each test
    Object.keys(games).forEach(key => delete games[key]);
  });

  test('should be an empty object initially', () => {
    expect(games).toEqual({});
    expect(Object.keys(games)).toHaveLength(0);
  });

  test('should allow adding new games', () => {
    games['test123'] = { players: [], status: 'waiting' };
    
    expect(games['test123']).toBeDefined();
    expect(games['test123'].players).toEqual([]);
    expect(games['test123'].status).toBe('waiting');
  });

  test('should allow updating existing games', () => {
    games['game1'] = { players: [], status: 'waiting' };
    
    // Update game
    games['game1'].status = 'started';
    games['game1'].players.push({ id: 'socket1', username: 'player1', vote: null });
    
    expect(games['game1'].status).toBe('started');
    expect(games['game1'].players).toHaveLength(1);
    expect(games['game1'].players[0].username).toBe('player1');
  });

  test('should allow deleting games', () => {
    games['game1'] = { players: [], status: 'waiting' };
    games['game2'] = { players: [], status: 'waiting' };
    
    expect(Object.keys(games)).toHaveLength(2);
    
    delete games['game1'];
    
    expect(Object.keys(games)).toHaveLength(1);
    expect(games['game1']).toBeUndefined();
    expect(games['game2']).toBeDefined();
  });

  test('should handle complex game structures', () => {
    const gameData = {
      players: [
        { id: 'socket1', username: 'alice', vote: '5' },
        { id: 'socket2', username: 'bob', vote: null }
      ],
      status: 'started',
      creator: 'alice',
      revealed: false
    };
    
    games['complex'] = gameData;
    
    expect(games['complex']).toEqual(gameData);
    expect(games['complex'].players).toHaveLength(2);
    expect(games['complex'].players[0].vote).toBe('5');
    expect(games['complex'].players[1].vote).toBeNull();
  });

  test('should maintain references correctly', () => {
    const gameRef = { players: [], status: 'waiting' };
    games['ref-test'] = gameRef;
    
    // Modify through reference
    gameRef.status = 'started';
    
    expect(games['ref-test'].status).toBe('started');
  });

  test('should handle multiple games independently', () => {
    games['game1'] = { players: [{ username: 'player1' }], status: 'waiting' };
    games['game2'] = { players: [{ username: 'player2' }], status: 'started' };
    
    expect(games['game1'].status).toBe('waiting');
    expect(games['game2'].status).toBe('started');
    expect(games['game1'].players[0].username).toBe('player1');
    expect(games['game2'].players[0].username).toBe('player2');
  });

  test('should return undefined for non-existent games', () => {
    expect(games['nonexistent']).toBeUndefined();
  });

  test('should handle various data types as values', () => {
    games['string'] = 'test';
    games['number'] = 123;
    games['array'] = [1, 2, 3];
    games['object'] = { test: true };
    
    expect(games['string']).toBe('test');
    expect(games['number']).toBe(123);
    expect(games['array']).toEqual([1, 2, 3]);
    expect(games['object']).toEqual({ test: true });
  });

  test('should support Object.keys, Object.values, Object.entries', () => {
    games['game1'] = { status: 'waiting' };
    games['game2'] = { status: 'started' };
    
    const keys = Object.keys(games);
    const values = Object.values(games);
    const entries = Object.entries(games);
    
    expect(keys).toEqual(['game1', 'game2']);
    expect(values).toHaveLength(2);
    expect(entries).toHaveLength(2);
    expect(entries[0][0]).toBe('game1');
    expect(entries[0][1]).toEqual({ status: 'waiting' });
  });
});
