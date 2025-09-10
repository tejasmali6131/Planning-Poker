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
      currentTopic: options.currentTopic || null,
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
  },

  // Mock socket.io
  createMockSocket(id = 'socket123') {
    return {
      id,
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      rooms: new Set(),
      broadcast: {
        emit: jest.fn()
      }
    };
  },

  createMockIo() {
    return {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      on: jest.fn()
    };
  },

  // Performance testing helper
  measureExecutionTime(fn) {
    const startTime = process.hrtime();
    const result = fn();
    const endTime = process.hrtime(startTime);
    const durationMs = (endTime[0] * 1000) + (endTime[1] / 1e6);
    return { result, duration: durationMs };
  },

  // Memory usage helper
  getMemoryUsage() {
    return process.memoryUsage();
  },

  // Random test data generators
  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  randomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// Setup global console mocking for all tests
testHelpers.mockConsole();

module.exports = testHelpers;
