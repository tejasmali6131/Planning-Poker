const path = require('path');

describe('Backend Module Exports', () => {
  describe('Core Module Types', () => {
    test('should export correct module types', () => {
      const generateId = require('../../utils/generateId');
      const games = require('../../data/games');
      const gameRoutes = require('../../routes/gameRoutes');
      const setupSocket = require('../../socket');

      expect(typeof generateId).toBe('function');
      expect(typeof games).toBe('object');
      expect(Array.isArray(games)).toBe(false);
      expect(typeof gameRoutes).toBe('function');
      expect(gameRoutes.stack).toBeDefined(); // Express router has a stack property
      expect(typeof setupSocket).toBe('function');
    });
  });

  describe('Module Functionality', () => {
    test('should have working generateId function', () => {
      const generateId = require('../../utils/generateId');
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    test('should have Express router with route methods', () => {
      const gameRoutes = require('../../routes/gameRoutes');
      
      expect(typeof gameRoutes.get).toBe('function');
      expect(typeof gameRoutes.post).toBe('function');
    });
  });

  describe('File Structure', () => {
    test('should have all required files', () => {
      const fs = require('fs');
      const basePath = path.join(__dirname, '../..');
      
      const requiredFiles = [
        'utils/generateId.js',
        'data/games.js',
        'routes/gameRoutes.js',
        'socket.js',
        'server.js',
        'package.json'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(basePath, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });
});
