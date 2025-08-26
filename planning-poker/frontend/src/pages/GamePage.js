import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import Navbar from '../components/Navbar';
import VotingCards from '../components/VotingCards';
import UsersList from '../components/UsersList';
import { toast } from "react-toastify";
import './GamePage.css';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    players: [],
    creator: null,
    started: false,
    revealed: false,
    currentTopic: null
  });
  const [vote, setVote] = useState(null);
  const [roomConfig, setRoomConfig] = useState(null);
  const [topicInput, setTopicInput] = useState("");

  // Default fibonacci series, will be overridden by room config if available
  const defaultCards = [0, 1, 2, 3, 5, 8, 13, 21, 34, 65, "?"];
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate(`/game/${gameId}/join`);
      return;
    }

    // Load room configuration if available
    const savedConfig = localStorage.getItem(`room_${gameId}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setRoomConfig(config);
    }

    // Always emit joinGame - backend will handle duplicates intelligently
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
      .then(() => toast.success("Game link copied!"))
      .catch(() => toast.error("Failed to copy link"));
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
    setVote(null);
    setTopicInput("");
  };

  const handleStartGame = () => {
    // Send the topic to the backend instead of setting it locally
    socket.emit('startGame', { gameId, username, topic: topicInput });
    setTopicInput("");
  };

  const allVoted = gameState.players.length > 0 && gameState.players.every((p) => p.hasVoted);
  const isCreator = username === gameState.creator;

  // Get cards to display - use room config if available, otherwise default
  const cardsToDisplay = roomConfig ? roomConfig.cards : defaultCards;

  // Game Status Logic
  let currentGameState = "waiting";
  if (gameState.started && !gameState.revealed) {
    currentGameState = "voting";
  } else if (gameState.revealed) {
    currentGameState = "revealed";
  }

  // Calculate average for revealed state
  const calculateAverage = () => {
    if (!gameState.revealed || !gameState.players) return null;

    const numericVotes = gameState.players
      .filter(p => p.vote !== null && !isNaN(parseFloat(p.vote)) && isFinite(p.vote))
      .map(p => parseFloat(p.vote));

    if (numericVotes.length === 0) return null;

    const average = numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length;
    return average.toFixed(1);
  };

  const averageResult = calculateAverage();

  return (
    <div className="game-page">
      <div className="game-page-navbar">
        <Navbar />
      </div>

      {/* Room Header */}
      <div className="room-header">
        <div>
          <h1
            className="modeChange room-title"
          >
            {roomConfig ? roomConfig.name : `Planning Session`}
          </h1>
          <div className="room-info">
            <span
              className="modeChange room-info-item"
            >
              Room ID: <strong className="room-id">{gameId}</strong>
            </span>
            {roomConfig && (
              <span
                className="modeChange room-info-item"
              >
                Deck: {roomConfig.deckType} ({cardsToDisplay.join(", ")})
              </span>
            )}
          </div>
        </div>

        <div className="header-buttons">
          <button
            onClick={handleCopyLink}
            className="copy-link-btn"
          >
            Copy Link
          </button>

          {isCreator && (
            <>
              {!gameState.started && gameState.players.length >= 2 && (
                <button
                  onClick={handleStartGame}
                  className="start-game-btn"
                >
                  Start Game
                </button>
              )}

              {gameState.started && !gameState.revealed && allVoted && (
                <button
                  onClick={handleReveal}
                  className="reveal-cards-btn"
                >
                  Reveal Cards
                </button>
              )}

              {gameState.revealed && (
                <button
                  onClick={handleRestart}
                  className="new-round-btn"
                >
                  New Round
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Game Area */}
        <div className="game-area">
          {/* Center Game State Display */}
          <div className="game-center">
            <h2
              className="modeChange game-state-title"
            >
              {currentGameState === "waiting" && "Waiting to Start"}
              {currentGameState === "voting" && "Voting in Progress"}
              {currentGameState === "revealed" && "Results"}
            </h2>

            {/* Topic Display */}
            {gameState.currentTopic && (
              <div className="topic-display">
                <h3
                  className="modeChange topic-title"
                >
                  Topic: {gameState.currentTopic}
                </h3>
              </div>
            )}

            {currentGameState === "waiting" && (
              <div className="waiting-content">
                <p className="modeChange waiting-text">
                  {gameState.players.length < 2
                    ? "Waiting for more players to join..."
                    : "Ready to start voting when the creator begins the session"}
                </p>

                {/* Topic Input for Creator */}
                {isCreator && gameState.players.length >= 2 && (
                  <div className="topic-input-container">
                    <input
                      type="text"
                      placeholder="Enter topic for this round (optional)"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      className="topic-input"
                    />
                  </div>
                )}

                {gameState.players.length >= 2 && !isCreator && (
                  <p className="modeChange creator-only-text">
                    Only the room creator can start the voting session
                  </p>
                )}
              </div>
            )}

            {currentGameState === "voting" && (
              <div className="voting-content">
                <p className="modeChange voting-status">
                  {gameState.players.filter(p => p.hasVoted).length} of {gameState.players.length} participants have voted
                </p>
                {vote && (
                  <p className="modeChange user-vote">
                    Your vote: {vote}
                  </p>
                )}
              </div>
            )}

            {currentGameState === "revealed" && (
              <div className="revealed-content">
                <h3 className="modeChange revealed-title">
                  All Votes Revealed!
                </h3>

                {/* Display All Votes */}
                <div className="votes-grid">
                  {gameState.players.map((player, index) => (
                    <div
                      key={index}
                      className={`player-vote-card ${player.username === username ? 'current-user' : ''}`}
                    >
                      {/* Player Avatar */}
                      <div
                        className={`player-avatar ${player.username === username ? 'current-user' : ''}`}
                      >
                        {player.username.charAt(0).toUpperCase()}
                      </div>

                      {/* Player Name */}
                      <div
                        className={`modeChange player-name ${player.username === username ? 'current-user' : ''}`}
                      >
                        {player.username}
                        {player.username === username && (
                          <span className="you-indicator"> (You)</span>
                        )}
                      </div>

                      {/* Vote Display */}
                      <div className="vote-display">
                        {player.vote !== null && player.vote !== undefined ? player.vote : "?"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show Average if there are numeric votes */}
                {averageResult && (
                  <div className="average-result">
                    <h4 className="modeChange average-title">
                      Average: {averageResult}
                    </h4>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voting Cards - Hide when revealed */}
          {currentGameState !== "revealed" && (
            <VotingCards
              cards={cardsToDisplay}
              selectedCard={vote}
              onCardSelect={handleVote}
              gameState={currentGameState}
              disabled={currentGameState !== "voting"}
            />
          )}
        </div>

        {/* Users List */}
        <div className="users-list">
          <UsersList
            players={gameState.players}
            currentUsername={username}
            gameState={currentGameState}
          />
        </div>
      </div>
    </div>
  );
}