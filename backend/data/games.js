/**
 * Production-ready in-memory game store with automatic cleanup.
 * 
 * This enhanced in-memory store includes:
 * - Automatic cleanup of empty/inactive games
 * - Activity tracking for each game
 * - Memory-efficient game management
 * - Production-ready for multiple users across devices
 */

class GameStore {
  constructor() {
    this.games = {};
    this.CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    this.GAME_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours of inactivity
    
    // Start automatic cleanup
    this.startCleanupTimer();
    
    console.log('Game store initialized with automatic cleanup');
  }

  // Create or get a game
  createGame(gameId, creator = 'Anonymous') {
    if (!this.games[gameId]) {
      this.games[gameId] = {
        players: [],
        started: false,
        creator,
        revealed: false,
        currentTopic: null,
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      console.log(`New game created: ${gameId} by ${creator}`);
    }
    
    // Update last activity
    this.games[gameId].lastActivity = Date.now();
    return this.games[gameId];
  }

  // Get a game by ID
  getGame(gameId) {
    const game = this.games[gameId];
    if (game) {
      game.lastActivity = Date.now();
    }
    return game;
  }

  // Remove a game
  removeGame(gameId) {
    if (this.games[gameId]) {
      const playerCount = this.games[gameId].players.length;
      delete this.games[gameId];
      console.log(`Game removed: ${gameId} (had ${playerCount} players)`);
      return true;
    }
    return false;
  }

  // Get all games (for monitoring)
  getAllGames() {
    return { ...this.games };
  }

  // Get games count
  getGamesCount() {
    return Object.keys(this.games).length;
  }

  // Get total players across all games
  getTotalPlayers() {
    return Object.values(this.games).reduce((total, game) => total + game.players.length, 0);
  }

  // Cleanup empty or inactive games
  cleanup() {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [gameId, game] of Object.entries(this.games)) {
      const shouldRemove = 
        // Game has no players
        game.players.length === 0 || 
        // Game is inactive for too long
        (now - game.lastActivity) > this.GAME_TIMEOUT;
      
      if (shouldRemove) {
        delete this.games[gameId];
        removedCount++;
        console.log(`Cleaned up inactive game: ${gameId}`);
      }
    }
    
    if (removedCount > 0) {
      console.log(`Cleanup completed: ${removedCount} games removed, ${this.getGamesCount()} games remaining`);
    }
    
    return removedCount;
  }

  // Start automatic cleanup timer
  startCleanupTimer() {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
    
    console.log(`Cleanup timer started: every ${this.CLEANUP_INTERVAL / 1000 / 60} minutes`);
  }

  // Graceful shutdown
  shutdown() {
    const gameCount = this.getGamesCount();
    const playerCount = this.getTotalPlayers();
    
    if (gameCount > 0) {
      console.log(`Shutting down game store: ${gameCount} active games, ${playerCount} total players`);
    }
    
    // Clear all games
    this.games = {};
  }
}

// Create singleton instance
const gameStore = new GameStore();

// Export games object for backward compatibility
module.exports = new Proxy(gameStore.games, {
  get(target, prop) {
    if (prop === 'cleanup') return () => gameStore.cleanup();
    if (prop === 'getGamesCount') return () => gameStore.getGamesCount();
    if (prop === 'getTotalPlayers') return () => gameStore.getTotalPlayers();
    if (prop === 'getAllGames') return () => gameStore.getAllGames();
    if (prop === 'createGame') return (gameId, creator) => gameStore.createGame(gameId, creator);
    if (prop === 'getGame') return (gameId) => gameStore.getGame(gameId);
    if (prop === 'removeGame') return (gameId) => gameStore.removeGame(gameId);
    return target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  deleteProperty(target, prop) {
    delete target[prop];
    return true;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target);
  },
  has(target, prop) {
    return prop in target;
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  gameStore.shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  gameStore.shutdown();
  process.exit(0);
});
