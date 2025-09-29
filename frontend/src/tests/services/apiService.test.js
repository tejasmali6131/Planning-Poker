import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../socket', () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  removeAllListeners: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Mock the baseUrl directly on the apiService instance
    apiService.baseUrl = 'http://localhost:3000';
  });

  describe('Socket operations', () => {
    test('should emit joinGame event with correct parameters', () => {
      const mockSocket = require('../../socket');
      apiService.joinGame('game123', 'testUser');
      
      expect(mockSocket.emit).toHaveBeenCalledWith('joinGame', {
        gameId: 'game123',
        username: 'testUser'
      });
    });

    test('should emit vote event with correct parameters', () => {
      const mockSocket = require('../../socket');
      apiService.submitVote('game123', 'testUser', '5');
      
      expect(mockSocket.emit).toHaveBeenCalledWith('vote', {
        gameId: 'game123',
        username: 'testUser',
        vote: '5'
      });
    });

    test('should emit startGame event with topic', () => {
      const mockSocket = require('../../socket');
      apiService.startGame('game123', 'testUser', 'Sprint Planning');
      
      expect(mockSocket.emit).toHaveBeenCalledWith('startGame', {
        gameId: 'game123',
        username: 'testUser',
        topic: 'Sprint Planning'
      });
    });

    test('should emit restartGame event', () => {
      const mockSocket = require('../../socket');
      apiService.restartGame('game123');
      
      expect(mockSocket.emit).toHaveBeenCalledWith('restartGame', {
        gameId: 'game123'
      });
    });

    test('should emit revealVotes event', () => {
      const mockSocket = require('../../socket');
      apiService.revealVotes('game123');
      
      expect(mockSocket.emit).toHaveBeenCalledWith('reveal', {
        gameId: 'game123'
      });
    });

    test('should register socket event listeners', () => {
      const mockSocket = require('../../socket');
      const callback = jest.fn();
      
      apiService.onConnect(callback);
      apiService.onDisconnect(callback);
      apiService.onGameStateUpdate(callback);
      apiService.onGameRestarted(callback);
      
      expect(mockSocket.on).toHaveBeenCalledWith('connect', callback);
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', callback);
      expect(mockSocket.on).toHaveBeenCalledWith('updateGameState', callback);
      expect(mockSocket.on).toHaveBeenCalledWith('gameRestarted', callback);
    });

    test('should remove event listeners with callback', () => {
      const mockSocket = require('../../socket');
      const callback = jest.fn();
      
      apiService.off('testEvent', callback);
      expect(mockSocket.off).toHaveBeenCalledWith('testEvent', callback);
    });

    test('should remove event listeners without callback', () => {
      const mockSocket = require('../../socket');
      
      apiService.off('testEvent');
      expect(mockSocket.off).toHaveBeenCalledWith('testEvent');
    });

    test('should remove specific listeners', () => {
      const mockSocket = require('../../socket');
      
      apiService.removeGameStateListener();
      apiService.removeGameRestartListener();
      apiService.removeUsernameExistsListener();
      apiService.removeJoinSuccessListener();
      
      expect(mockSocket.off).toHaveBeenCalledWith('updateGameState');
      expect(mockSocket.off).toHaveBeenCalledWith('gameRestarted');
      expect(mockSocket.off).toHaveBeenCalledWith('usernameExists');
      expect(mockSocket.off).toHaveBeenCalledWith('joinSuccess');
    });

    test('should remove all listeners', () => {
      const mockSocket = require('../../socket');
      
      apiService.removeAllListeners();
      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
    });
  });

  describe('LocalStorage operations', () => {
    test('should save and retrieve username successfully', () => {
      localStorageMock.setItem.mockReturnValue(undefined);
      localStorageMock.getItem.mockReturnValue('testUser');
      
      const saveResult = apiService.saveUsername('testUser');
      const retrievedUsername = apiService.getUsername();
      
      expect(saveResult).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('username', 'testUser');
      expect(retrievedUsername).toBe('testUser');
    });

    test('should handle localStorage errors successfully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = apiService.saveUsername('testUser');
      
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Failed to save username');
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    test('should save and load room config', () => {
      const config = { votingSystem: 'fibonacci', timer: 300 };
      localStorageMock.setItem.mockReturnValue(undefined);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(config));
      
      const saveResult = apiService.saveRoomConfig('game123', config);
      const loadedConfig = apiService.loadRoomConfig('game123');
      
      expect(saveResult).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('room_game123', JSON.stringify(config));
      expect(loadedConfig).toEqual(config);
    });

    test('should return null when loading non-existent room config', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const config = apiService.loadRoomConfig('nonexistent');
      expect(config).toBeNull();
    });

    test('should remove room config successfully', () => {
      apiService.removeRoomConfig('game123');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('room_game123');
    });

    test('should remove username successfully', () => {
      apiService.removeUsername();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
    });
  });

  describe('Vote calculation', () => {
    test('should calculate voting average correctly', () => {
      const players = [
        { username: 'user1', vote: '3' },
        { username: 'user2', vote: '5' },
        { username: 'user3', vote: '8' }
      ];
      
      const average = apiService.calculateVotingAverage(players);
      expect(average).toBe('5.3');
    });

    test('should return null for non-numeric votes', () => {
      const players = [
        { username: 'user1', vote: '?' },
        { username: 'user2', vote: 'coffee' },
        { username: 'user3', vote: null }
      ];
      
      const average = apiService.calculateVotingAverage(players);
      expect(average).toBeNull();
    });

    test('should handle empty or null players array', () => {
      expect(apiService.calculateVotingAverage([])).toBeNull();
      expect(apiService.calculateVotingAverage(null)).toBeNull();
    });
  });

  describe('HTTP API methods', () => {
    test('should make request with correct URL and method', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      const result = await apiService.get('/test-endpoint');
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test-endpoint',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle HTTP errors and show toast', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      await expect(apiService.get('/non-existent')).rejects.toThrow('HTTP error! status: 404');
      expect(toast.error).toHaveBeenCalledWith('Failed to communicate with server');
    });

    test('should make POST request with data', async () => {
      const mockResponse = { success: true };
      const postData = { gameId: 'test123' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      const result = await apiService.post('/create-game', postData);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/create-game'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should make PUT request with data', async () => {
      const mockResponse = { updated: true };
      const putData = { name: 'updated' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      const result = await apiService.put('/update-item', putData);
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/update-item',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should make DELETE request', async () => {
      const mockResponse = { deleted: true };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      const result = await apiService.delete('/delete-item');
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/delete-item',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle network fetch errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(apiService.get('/network-fail')).rejects.toThrow('Network error');
      expect(toast.error).toHaveBeenCalledWith('Failed to communicate with server');
    });
  });

  describe('Game link generation', () => {
    test('should generate game link with fallback to current origin', async () => {
      // Mock failed network info request
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Mock window.location
      delete window.location;
      window.location = { origin: 'http://localhost:3000' };
      
      const link = await apiService.generateGameLink('game123');
      
      expect(link).toBe('http://localhost:3000/game/game123');
    });

    test('should copy game link to clipboard successfully', async () => {
      delete window.location;
      window.location = { origin: 'http://localhost:3000' };
      window.isSecureContext = true;
      
      navigator.clipboard.writeText.mockResolvedValueOnce();
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const result = await apiService.copyGameLink('game123');
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/game/game123');
      expect(toast.success).toHaveBeenCalledWith('Game link copied!');
    });

    test('should handle copy failure and show prompt', async () => {
      delete window.location;
      window.location = { origin: 'http://localhost:3000' };
      window.isSecureContext = true;
      
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Mock window.prompt
      const promptSpy = jest.spyOn(window, 'prompt').mockImplementation();
      
      const result = await apiService.copyGameLink('game123');
      
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Failed to copy link: Copy failed');
      expect(promptSpy).toHaveBeenCalledWith('Copy this link manually:', 'http://localhost:3000/game/game123');
      
      promptSpy.mockRestore();
    });
  });
});
