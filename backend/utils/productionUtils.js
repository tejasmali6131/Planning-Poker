/**
 * Production utilities for Planning Poker server.
 * 
 * This module provides utilities for production deployments including:
 * - Memory monitoring and alerts
 * - Automatic cleanup scheduling
 * - Health checks and logging
 */

const games = require('../data/games');

class ProductionUtils {
  constructor() {
    this.MEMORY_CHECK_INTERVAL = 60000; // 1 minute
    this.MEMORY_WARNING_THRESHOLD = 100 * 1024 * 1024; // 100MB
    this.MEMORY_CRITICAL_THRESHOLD = 200 * 1024 * 1024; // 200MB
  }

  // Start production monitoring
  startMonitoring() {
    // Memory monitoring
    setInterval(() => {
      this.checkMemoryUsage();
    }, this.MEMORY_CHECK_INTERVAL);

    // Log server stats periodically
    setInterval(() => {
      this.logServerStats();
    }, 5 * 60 * 1000); // Every 5 minutes

    console.log('Production monitoring started');
  }

  // Check memory usage and warn if high
  checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    
    if (memUsage.heapUsed > this.MEMORY_CRITICAL_THRESHOLD) {
      console.warn(`CRITICAL: High memory usage detected: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
      console.warn(`Active games: ${games.getGamesCount()}, Players: ${games.getTotalPlayers()}`);
      
      // Force cleanup when memory is critical
      const cleaned = games.cleanup();
      console.log(`Emergency cleanup performed: ${cleaned} games removed`);
      
    } else if (memUsage.heapUsed > this.MEMORY_WARNING_THRESHOLD) {
      console.warn(`WARNING: Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
    }
  }

  // Log server statistics
  logServerStats() {
    const stats = {
      activeGames: games.getGamesCount(),
      totalPlayers: games.getTotalPlayers(),
      memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeHours: Math.round(process.uptime() / 3600 * 10) / 10
    };
    
    console.log(`Server Stats: ${stats.activeGames} games, ${stats.totalPlayers} players, ${stats.memoryMB}MB memory, ${stats.uptimeHours}h uptime`);
  }

  // Get production health status
  getHealthStatus() {
    const memUsage = process.memoryUsage();
    const stats = {
      status: 'healthy',
      activeGames: games.getGamesCount(),
      totalPlayers: games.getTotalPlayers(),
      memoryUsageMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    };

    // Determine health status
    if (memUsage.heapUsed > this.MEMORY_CRITICAL_THRESHOLD) {
      stats.status = 'critical';
      stats.alerts = ['High memory usage'];
    } else if (memUsage.heapUsed > this.MEMORY_WARNING_THRESHOLD) {
      stats.status = 'warning';
      stats.alerts = ['Elevated memory usage'];
    }

    return stats;
  }

  // Setup graceful shutdown
  setupGracefulShutdown(server) {
    const shutdown = (signal) => {
      console.log(`Received ${signal}, starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
        
        // Log final stats
        const finalStats = {
          activeGames: games.getGamesCount(),
          totalPlayers: games.getTotalPlayers(),
          uptimeSeconds: Math.round(process.uptime())
        };
        
        console.log(`Final stats: ${finalStats.activeGames} games, ${finalStats.totalPlayers} players, ${finalStats.uptimeSeconds}s uptime`);
        
        process.exit(0);
      });
      
      // Force exit after 30 seconds
      setTimeout(() => {
        console.log('Forced shutdown due to timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    console.log('Graceful shutdown handlers registered');
  }
}

module.exports = new ProductionUtils();