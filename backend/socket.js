const games = require('./data/games');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`New WebSocket connection: ${socket.id}`);

    // Join a game
    socket.on('joinGame', ({ gameId, username }) => {
      console.log(`Player joining: ${username} → ${gameId} (socket: ${socket.id})`);

      // If game does not exist, create it
      if (!games[gameId]) {
        games[gameId] = { 
          players: [], 
          started: false, 
          creator: username, 
          revealed: false,
          currentTopic: null
        };
        console.log(`New game created: ${gameId}`);
      }

      // Check if this socket is already in the game with the same username
      const existingPlayerBySocket = games[gameId].players.find(p => p.id === socket.id);
      if (existingPlayerBySocket) {
        if (existingPlayerBySocket.username === username) {
          // Same socket, same username - just send success again (idempotent)
          console.log(`Player ${username} already joined, sending success again`);
          socket.emit('joinSuccess', { gameId, username });
          io.to(gameId).emit('updateGameState', games[gameId]);
          return;
        } else {
          // Same socket, different username - update the username
          console.log(`Updating username for socket ${socket.id} from ${existingPlayerBySocket.username} to ${username}`);
          existingPlayerBySocket.username = username;
          socket.emit('joinSuccess', { gameId, username });
          io.to(gameId).emit('updateGameState', games[gameId]);
          return;
        }
      }

      // Check for duplicate usernames (but only for different sockets)
      const existingPlayerByName = games[gameId].players.find(p => p.username === username && p.id !== socket.id);
      if (existingPlayerByName) {
        // Username already exists with a different socket, emit error
        console.log(`Duplicate username: ${username} in ${gameId}`);
        socket.emit('usernameExists', { message: 'Username already exists!! Try a different one.' });
        return;
      }

      // Add the new player
      games[gameId].players.push({ id: socket.id, username, vote: null });
      console.log(`Player added: ${username} (${games[gameId].players.length} total)`);

      socket.join(gameId);

      // Send success event to the joining player
      socket.emit('joinSuccess', { gameId, username });
      
      // Send updated game state to all players in the room
      io.to(gameId).emit('updateGameState', games[gameId]);
    });

    // Start game (only creator)
    socket.on('startGame', ({ gameId, username, topic }) => {
      if (games[gameId] && games[gameId].creator === username) {
        games[gameId].started = true;
        games[gameId].currentTopic = topic || null;
        io.to(gameId).emit('updateGameState', games[gameId]);
        console.log(`Game started: ${gameId}${topic ? ` with topic: ${topic}` : ''}`);
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
        games[gameId].currentTopic = null;

        io.to(gameId).emit('updateGameState', games[gameId]);
        io.to(gameId).emit('gameRestarted');
        console.log(`Game restarted: ${gameId}`);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      for (const gameId in games) {
        const game = games[gameId];
        const index = game.players.findIndex(p => p.id === socket.id);
        if (index !== -1) {
          console.log(`Player disconnected: ${game.players[index].username}`);
          game.players.splice(index, 1);

          io.to(gameId).emit('updateGameState', game);
        }
      }
    });
  });
}

module.exports = setupSocket;
