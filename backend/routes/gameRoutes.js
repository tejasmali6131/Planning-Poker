/**
 * Express router for Planning Poker REST API endpoints and game management.
 * 
 * 1. Problem: Need HTTP endpoints for game creation, health monitoring, and network
 *    configuration to support Planning Poker sessions across different devices.
 * 2. Solution: RESTful API routes that handle game lifecycle, health checks, and
 *    cross-device sharing capabilities with tunnel URL management for remote access.
 * 3. Implementation: Game creation/retrieval endpoints, health monitoring, network
 *    info APIs for shareable links, and dynamic tunnel URL configuration support.
 */

const express = require('express');
const generateId = require('../utils/generateId');
const games = require('../data/games');
const productionUtils = require('../utils/productionUtils');
const router = express.Router();

// Enhanced health check endpoint
router.get('/health', (req, res) => {
  try {
    const health = productionUtils.getHealthStatus();
    const httpStatus = health.status === 'critical' ? 503 : 200;
    res.status(httpStatus).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Get network info for generating shareable links
router.get('/network-info', (req, res) => {
  const port = process.env.PORT || 4000;
  let shareableUrl;
  
  // Production deployment (Render, Railway, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Use Render's external URL if available
    if (process.env.RENDER_EXTERNAL_URL) {
      shareableUrl = process.env.RENDER_EXTERNAL_URL;
    }
    // Use Railway's public URL if available
    else if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      shareableUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    }
    // Generic production URL from request headers
    else if (req.get('host')) {
      const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
      shareableUrl = `${protocol}://${req.get('host')}`;
    }
    // Fallback for production
    else {
      shareableUrl = `http://localhost:${port}`;
    }
  }
  // Development mode - use tunnel URL for cross-device testing
  else {
    shareableUrl = process.env.DEV_TUNNEL_URL || 'https://ngth2fs5-4000.asse.devtunnels.ms';
    
    // Allow override via query parameter for testing
    if (req.query.tunnelUrl) {
      shareableUrl = req.query.tunnelUrl;
    }
  }
  
  res.json({
    shareableUrl,
    localUrl: `http://localhost:${port}`,
    tunnelUrl: process.env.DEV_TUNNEL_URL,
    port,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Update tunnel URL dynamically (for testing)
router.post('/update-tunnel', (req, res) => {
  const { tunnelUrl } = req.body;
  if (tunnelUrl) {
    process.env.DEV_TUNNEL_URL = tunnelUrl;
    res.json({ success: true, newTunnelUrl: tunnelUrl });
  } else {
    res.status(400).json({ error: 'tunnelUrl is required' });
  }
});

// Create new game
router.post('/create-game', (req, res) => {
  try {
    const gameId = generateId();
    const creator = req.body.creator || 'Anonymous';
    
    const game = games.createGame(gameId, creator);
    res.json({ 
      gameId,
      creator: game.creator,
      createdAt: game.createdAt,
      status: 'waiting'
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Get game info
router.get('/game/:gameId', (req, res) => {
  try {
    const game = games.getGame(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Return safe game info (hide socket IDs)
    const safeGame = {
      gameId: req.params.gameId,
      creator: game.creator,
      started: game.started,
      revealed: game.revealed,
      currentTopic: game.currentTopic,
      playerCount: game.players.length,
      players: game.players.map(p => ({
        username: p.username,
        hasVoted: p.vote !== null,
        vote: game.revealed ? p.vote : null
      })),
      createdAt: game.createdAt,
      lastActivity: game.lastActivity
    };
    
    res.json(safeGame);
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ error: 'Failed to get game info' });
  }
});

// Get server stats (for monitoring)
router.get('/stats', (req, res) => {
  try {
    const stats = {
      activeGames: games.getGamesCount(),
      totalPlayers: games.getTotalPlayers(),
      serverUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get server stats' });
  }
});

// Manual cleanup trigger (for admin)
router.post('/admin/cleanup', (req, res) => {
  try {
    const removedCount = games.cleanup();
    res.json({
      message: 'Cleanup completed',
      removedGames: removedCount,
      activeGames: games.getGamesCount(),
      totalPlayers: games.getTotalPlayers()
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ error: 'Failed to cleanup games' });
  }
});

// Get all games info (for admin/debugging)
router.get('/admin/games', (req, res) => {
  try {
    const allGames = games.getAllGames();
    const gamesList = Object.entries(allGames).map(([gameId, game]) => ({
      gameId,
      creator: game.creator,
      playerCount: game.players.length,
      started: game.started,
      createdAt: new Date(game.createdAt).toISOString(),
      lastActivity: new Date(game.lastActivity).toISOString(),
      inactiveFor: Math.round((Date.now() - game.lastActivity) / 1000 / 60) + ' minutes'
    }));
    
    res.json({
      totalGames: gamesList.length,
      totalPlayers: games.getTotalPlayers(),
      games: gamesList
    });
  } catch (error) {
    console.error('Error getting all games:', error);
    res.status(500).json({ error: 'Failed to get games list' });
  }
});

module.exports = router;
