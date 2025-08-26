const path = require('path');

// Test helper functions
const testHelpers = {
  // Mock console methods to reduce noise during testing
  mockConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    beforeEach(() => {
      console.log = jest.fn();
      console.error = jest.fn();
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    });
  },

  // Generate test data
  createTestGame(options = {}) {
    return {
      players: options.players || [],
      started: options.started || false,
      creator: options.creator || 'testUser',
      revealed: options.revealed || false,
      ...options
    };
  },

  createTestPlayer(options = {}) {
    return {
      id: options.id || 'socket123',
      username: options.username || 'testPlayer',
      vote: options.vote || null,
      ...options
    };
  },

  // Wait for async operations in tests
  waitFor(ms = 10) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Assert helpers
  expectGameToHavePlayer(game, username) {
    expect(game.players.some(p => p.username === username)).toBe(true);
  },

  expectGameNotToHavePlayer(game, username) {
    expect(game.players.some(p => p.username === username)).toBe(false);
  }
};

module.exports = testHelpers;
