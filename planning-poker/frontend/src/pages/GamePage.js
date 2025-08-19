import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({ players: [], creator: null, started: false, revealed: false });
  const [vote, setVote] = useState(null);

  const fibonacciSeries = [0, 1, 2, 3, 5, 8, 13, 21, 34, 65];
  const username = localStorage.getItem('username');
  
  useEffect(() => {
    if (!username) {
      navigate(`/`);
      return;
    }

    socket.emit('joinGame', { gameId, username });

    socket.on('updateGameState', (state) => {
      setGameState(state);
    });

    socket.on('gameRestarted', () => {
      setVote(null);
    });

    return () => {
      socket.off('updateGameState');
      socket.off('gameRestarted');
    };
  }, [gameId, username, navigate]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Game link copied!'))
      .catch((err) => console.error('Failed to copy link', err));
  };

  const handleVote = (num) => {
    setVote(num);
    socket.emit('vote', { gameId, username, vote: num });
  };

  const handleReveal = () => {
    socket.emit('reveal', { gameId });
  };

  const handleRestart = () => {
    socket.emit('restartGame', { gameId });
  };

  const handleStartGame = () => {
    socket.emit('startGame', { gameId, username });
  };

  const allVoted = gameState.players.length > 0 && gameState.players.every((p) => p.hasVoted);

  // 🔹 Game Status
  let statusMessage = "Waiting for players...";
  if (gameState.players.length > 1 && !gameState.started) {
    statusMessage = "Waiting for the creator to start the game...";
  } else if (gameState.started && !gameState.revealed) {
    statusMessage = "Game in progress";
  } else if (gameState.revealed) {
    statusMessage = "Votes revealed!";
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Game ID: {gameId}</h2>
        <button onClick={handleCopyLink}>Copy Link</button>
      </div>

      <h3>Status: {statusMessage}</h3>

      {username === gameState.creator && !gameState.started && gameState.players.length > 1 && (
        <button onClick={handleStartGame}>Start Game</button>
      )}

      <h3>Players</h3>
      <div className="players-list">
        {gameState.players.map((p, idx) => (
          <div key={idx} className="player-card">
            {p.username} —{" "}
            {gameState.revealed ? (
              <span style={{ color: "blue" }}>{p.vote}</span>
            ) : p.hasVoted ? (
              <span style={{ color: "green" }}>✅ Voted</span>
            ) : (
              <span style={{ color: "orange" }}>⏳ Waiting</span>
            )}
          </div>
        ))}
      </div>

      {gameState.started && !gameState.revealed && (
        <>
          <h3>Vote</h3>
          <div className="vote-section">
            {fibonacciSeries.map((num) => (
              <button 
                key={num} 
                onClick={() => handleVote(num)}
                style={{
                  backgroundColor: vote === num ? "#4caf50" : "white",
                  color: vote === num ? "white" : "black"
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🔹 Show Reveal & Restart only to the creator */}
      {username === gameState.creator && (
        <div className="controls">
          <button onClick={handleReveal} disabled={!allVoted || gameState.revealed}>
            Reveal Cards
          </button>
          <button onClick={handleRestart}>Restart Game</button>
        </div>
      )}
    </div>
  );
}
