const games = require('./data/games');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🟢 New WebSocket connection: ${socket.id}`);

    // Join a game
    socket.on('joinGame', ({ gameId, username }) => {
      console.log(`📥 Player joining game: ${username}`);

      // If game does not exist, create it
      if (!games[gameId]) {
        games[gameId] = { players: [], started: false, creator: username, revealed: false };
        console.log(`🆕 Created new game: ${gameId}`);
      }

      // Prevent duplicate usernames in the same game
      const existingPlayer = games[gameId].players.find(p => p.username === username);
      if (!existingPlayer) {
        games[gameId].players.push({ id: socket.id, username, vote: null });
      }

      socket.join(gameId);

      io.to(gameId).emit('updateGameState', games[gameId]);
    });

    // Start game (only creator)
    socket.on('startGame', ({ gameId, username }) => {
      if (games[gameId] && games[gameId].creator === username) {
        games[gameId].started = true;
        io.to(gameId).emit('updateGameState', games[gameId]);
        console.log(`🚀 Game started: ${gameId}`);
      }
    });

    // Vote
    socket.on('vote', ({ gameId, username, vote }) => {
      const player = games[gameId]?.players.find(p => p.username === username);
      if (player) player.vote = vote;

      games[gameId].revealed = false; // reset reveal until explicitly revealed

      // Send hasVoted for everyone, hide votes until reveal
      io.to(gameId).emit('updateGameState', {
        ...games[gameId],
        players: games[gameId].players.map(p => ({
          username: p.username,
          hasVoted: p.vote !== null,
          vote: games[gameId].revealed ? p.vote : null
        }))
      });
    });

    // Reveal votes
    socket.on('reveal', ({ gameId }) => {
      if (games[gameId]) {
        games[gameId].revealed = true;
        io.to(gameId).emit('updateGameState', games[gameId]); // now sends full votes
      }
    });

    // Restart game
    socket.on('restartGame', ({ gameId }) => {
      if (games[gameId]) {
        games[gameId].players.forEach(p => p.vote = null);
        games[gameId].started = false;
        games[gameId].revealed = false;

        io.to(gameId).emit('updateGameState', games[gameId]);
        io.to(gameId).emit('gameRestarted');
        console.log(`🔄 Game restarted: ${gameId}`);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      for (const gameId in games) {
        const game = games[gameId];
        const index = game.players.findIndex(p => p.id === socket.id);
        if (index !== -1) {
          console.log(`❌ Player disconnected: ${game.players[index].username}`);
          game.players.splice(index, 1);

          io.to(gameId).emit('updateGameState', game);
        }
      }
    });
  });
}

module.exports = setupSocket;
