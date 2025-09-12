import socket from '../socket';
import { toast } from 'react-toastify';

//Centralized API Service for Planning Poker Application
class ApiService {
  constructor() {
    this.socket = socket;
    this.baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
  }

  joinGame(gameId, username) {
    this.socket.emit('joinGame', { gameId, username });
  }

  startGame(gameId, username, topic = '') {
    this.socket.emit('startGame', { gameId, username, topic });
  }

  restartGame(gameId) {
    this.socket.emit('restartGame', { gameId });
  }

  submitVote(gameId, username, vote) {
    this.socket.emit('vote', { gameId, username, vote });
  }

  revealVotes(gameId) {
    this.socket.emit('reveal', { gameId });
  }

  onGameStateUpdate(callback) {
    this.socket.on('updateGameState', callback);
  }

  onGameRestarted(callback) {
    this.socket.on('gameRestarted', callback);
  }

  onUsernameExists(callback) {
    this.socket.on('usernameExists', callback);
  }

  onJoinSuccess(callback) {
    this.socket.on('joinSuccess', callback);
  }

  onConnect(callback) {
    this.socket.on('connect', callback);
  }

  onDisconnect(callback) {
    this.socket.on('disconnect', callback);
  }

  off(event, callback = null) {
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  removeGameStateListener() {
    this.socket.off('updateGameState');
  }

  removeGameRestartListener() {
    this.socket.off('gameRestarted');
  }

  removeUsernameExistsListener() {
    this.socket.off('usernameExists');
  }

  removeJoinSuccessListener() {
    this.socket.off('joinSuccess');
  }

  // Use with caution - removes all listeners
  removeAllListeners() {
    this.socket.removeAllListeners();
  }

  saveRoomConfig(gameId, config) {
    try {
      localStorage.setItem(`room_${gameId}`, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Failed to save room config:', error);
      toast.error('Failed to save room configuration');
      return false;
    }
  }

  loadRoomConfig(gameId) {
    try {
      const savedConfig = localStorage.getItem(`room_${gameId}`);
      return savedConfig ? JSON.parse(savedConfig) : null;
    } catch (error) {
      console.error('Failed to load room config:', error);
      return null;
    }
  }

  removeRoomConfig(gameId) {
    try {
      localStorage.removeItem(`room_${gameId}`);
    } catch (error) {
      console.error('Failed to remove room config:', error);
    }
  }

  saveUsername(username) {
    try {
      localStorage.setItem('username', username);
      return true;
    } catch (error) {
      console.error('Failed to save username:', error);
      toast.error('Failed to save username');
      return false;
    }
  }

  getUsername() {
    try {
      return localStorage.getItem('username');
    } catch (error) {
      console.error('Failed to get username:', error);
      return null;
    }
  }

  removeUsername() {
    try {
      localStorage.removeItem('username');
    } catch (error) {
      console.error('Failed to remove username:', error);
    }
  }

  generateGameLink(gameId) {
    return `${window.location.origin}/game/${gameId}`;
  }

  async copyGameLink(gameId) {
    const link = this.generateGameLink(gameId);
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        toast.success("Game link copied!");
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        if (document.execCommand) {
          document.execCommand('copy');
        }
        
        document.body.removeChild(textArea);
        toast.success("Game link copied!");
        return true;
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error(`Failed to copy link: ${error.message}`);
      
      if (typeof window !== 'undefined' && window.prompt) {
        try {
          prompt('Copy this link manually:', link);
        } catch (promptError) {
          console.log('Game link:', link);
        }
      }
      return false;
    }
  }

  calculateVotingAverage(players) {
    if (!players || players.length === 0) return null;

    const numericVotes = players
      .filter(p => p.vote !== null && !isNaN(parseFloat(p.vote)) && isFinite(p.vote))
      .map(p => parseFloat(p.vote));

    if (numericVotes.length === 0) return null;

    const average = numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length;
    return average.toFixed(1);
  }

  // HTTP API methods for future REST endpoints
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}/api${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Failed to communicate with server');
      throw error;
    }
  }

  async get(endpoint, headers = {}) {
    return this.makeRequest(endpoint, {
      method: 'GET',
      headers
    });
  }

  async post(endpoint, data = {}, headers = {}) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}, headers = {}) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, headers = {}) {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
      headers
    });
  }
}

const apiService = new ApiService();
export default apiService;

export const {
  joinGame,
  startGame,
  restartGame,
  submitVote,
  revealVotes,
  onGameStateUpdate,
  onGameRestarted,
  onUsernameExists,
  onJoinSuccess,
  onConnect,
  onDisconnect,
  off,
  saveRoomConfig,
  loadRoomConfig,
  removeRoomConfig,
  saveUsername,
  getUsername,
  removeUsername,
  generateGameLink,
  copyGameLink,
  calculateVotingAverage,
  get,
  post,
  put,
  delete: deleteRequest
} = apiService;
