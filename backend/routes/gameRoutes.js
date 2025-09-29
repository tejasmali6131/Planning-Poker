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
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get network info for generating shareable links
router.get('/network-info', (req, res) => {
  // Use VS Code Dev Tunnel URL for cross-device sharing
  let devTunnelUrl = process.env.DEV_TUNNEL_URL || 'https://ngth2fs5-4000.asse.devtunnels.ms';
  
  // Allow override via query parameter for testing
  if (req.query.tunnelUrl) {
    devTunnelUrl = req.query.tunnelUrl;
  }
  
  const port = process.env.PORT || 4000;
  
  res.json({
    shareableUrl: devTunnelUrl,
    localUrl: `http://localhost:${port}`,
    tunnelUrl: devTunnelUrl,
    port,
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
  const gameId = generateId();
  games[gameId] = { players: [], status: 'waiting' };
  res.json({ gameId });
});

// Get game info
router.get('/game/:gameId', (req, res) => {
  const game = games[req.params.gameId];
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

module.exports = router;
