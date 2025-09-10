const express = require('express');
const generateId = require('../utils/generateId');
const games = require('../data/games');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
