const generateId = require('../../utils/generateId');

describe('Generate ID Utility', () => {
  describe('Basic Functionality', () => {
    test('should generate a 6-character alphanumeric string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(6);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const ids = new Set();
      const sampleSize = 100;

      for (let i = 0; i < sampleSize; i++) {
        const id = generateId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(sampleSize);
    });
  });

  describe('Character Set Validation', () => {
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    test('should only contain valid characters and no special characters', () => {
      for (let i = 0; i < 50; i++) {
        const id = generateId();
        
        // Check valid characters
        for (const char of id) {
          expect(allowedChars).toContain(char);
        }
        
        // Check no spaces or special characters
        expect(id).not.toMatch(/[^A-Za-z0-9]/);
        expect(id.trim()).toBe(id);
      }
    });
  });

  describe('Distribution and Randomness', () => {
    test('should use different character types', () => {
      const ids = [];
      for (let i = 0; i < 100; i++) {
        ids.push(generateId());
      }
      
      const allChars = ids.join('');
      expect(/[A-Z]/.test(allChars)).toBe(true);
      expect(/[a-z]/.test(allChars)).toBe(true);
      expect(/[0-9]/.test(allChars)).toBe(true);
    });

    test('should have low collision rate', () => {
      const ids = new Set();
      const sampleSize = 5000;

      for (let i = 0; i < sampleSize; i++) {
        ids.add(generateId());
      }

      // Expect at least 99.8% uniqueness
      const uniquenessRate = ids.size / sampleSize;
      expect(uniquenessRate).toBeGreaterThan(0.998);
    });
  });

  describe('Integration with Planning Poker', () => {
    test('should work as object keys and be URL-safe', () => {
      const games = {};
      const gameIds = [];
      
      for (let i = 0; i < 50; i++) {
        const gameId = generateId();
        gameIds.push(gameId);
        games[gameId] = { creator: `user${i}`, players: [] };
      }
      
      // All should be accessible and URL-safe
      gameIds.forEach((gameId, index) => {
        expect(games[gameId]).toBeDefined();
        expect(games[gameId].creator).toBe(`user${index}`);
        expect(gameId).toMatch(/^[A-Za-z0-9]+$/);
      });
    });
  });

  describe('Module Export', () => {
    test('should export a function', () => {
      expect(typeof generateId).toBe('function');
    });

    test('should be consistent across imports', () => {
      const generateId1 = require('../../utils/generateId');
      const generateId2 = require('../../utils/generateId');
      
      expect(generateId1).toBe(generateId2);
      expect(typeof generateId1).toBe('function');
    });
  });
});
