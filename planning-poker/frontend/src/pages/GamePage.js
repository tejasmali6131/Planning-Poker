import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import VotingCards from '../components/VotingCards';
import UsersList from '../components/UsersList';

const socket = io('http://localhost:4000');

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    players: [],
    creator: null,
    started: false,
    revealed: false
  });
  const [vote, setVote] = useState(null);
  const [roomConfig, setRoomConfig] = useState(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [topicInput, setTopicInput] = useState("");

  // Default fibonacci series, will be overridden by room config if available
  const defaultCards = [0, 1, 2, 3, 5, 8, 13, 21, 34, 65, "?"];
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate(`/`);
      return;
    }

    // Load room configuration if available
    const savedConfig = localStorage.getItem(`room_${gameId}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setRoomConfig(config);
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
    setVote(null);
    setCurrentTopic("");
    setTopicInput("");
  };

  const handleStartGame = () => {
    setCurrentTopic(topicInput);
    setTopicInput("");
    socket.emit('startGame', { gameId, username });
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #0068dfff" }}>
        <Navbar />
      </div>

      {/* Room Header */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h1
            className="modeChange"
            style={{
              color: "#004798ff",
              fontSize: "24px",
              margin: "0 0 5px 0"
            }}
          >
            {roomConfig ? roomConfig.name : `Planning Session`}
          </h1>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span
              className="modeChange"
              style={{ color: "#666", fontSize: "14px" }}
            >
              Room ID: <strong style={{ color: "#0068dfff", fontSize: "16px" }}>{gameId}</strong>
            </span>
            {roomConfig && (
              <span
                className="modeChange"
                style={{ color: "#666", fontSize: "14px" }}
              >
                Deck: {roomConfig.deckType} ({cardsToDisplay.join(", ")})
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCopyLink}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              color: "#0068dfff",
              backgroundColor: "transparent",
              border: "2px solid #0068dfff",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0068dfff";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#0068dfff";
            }}
          >
            Copy Link
          </button>

          {isCreator && (
            <>
              {!gameState.started && gameState.players.length >= 2 && (
                <button
                  onClick={handleStartGame}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "white",
                    backgroundColor: "#28a745",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                >
                  Start Game
                </button>
              )}

              {gameState.started && !gameState.revealed && allVoted && (
                <button
                  onClick={handleReveal}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "white",
                    backgroundColor: "#ffc107",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                >
                  Reveal Cards
                </button>
              )}

              {gameState.revealed && (
                <button
                  onClick={handleRestart}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "white",
                    backgroundColor: "#0068dfff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                >
                  New Round
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Game Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Center Game State Display */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              backgroundColor: "#fafbfc",
              position: "relative"
            }}
          >
            <h2
              className="modeChange"
              style={{
                margin: "0 0 20px 0",
                fontSize: "24px",
                color: "#004798ff",
                textAlign: "center"
              }}
            >
              {currentGameState === "waiting" && "Waiting to Start"}
              {currentGameState === "voting" && "Voting in Progress"}
              {currentGameState === "revealed" && "Results"}
            </h2>

            {/* Topic Display */}
            {currentTopic && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 20px",
                  backgroundColor: "#f0f8ff",
                  border: "2px solid #0068dfff",
                  borderRadius: "8px",
                  textAlign: "center"
                }}
              >
                <h3
                  className="modeChange"
                  style={{
                    margin: "0",
                    fontSize: "18px",
                    color: "#004798ff",
                    fontWeight: "600"
                  }}
                >
                  Topic: {currentTopic}
                </h3>
              </div>
            )}

            {currentGameState === "waiting" && (
              <div style={{ textAlign: "center" }}>
                <p className="modeChange" style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
                  {gameState.players.length < 2
                    ? "Waiting for more players to join..."
                    : "Ready to start voting when the creator begins the session"}
                </p>

                {/* Topic Input for Creator */}
                {isCreator && gameState.players.length >= 2 && (
                  <div style={{ marginBottom: "20px" }}>
                    <input
                      type="text"
                      placeholder="Enter topic for this round (optional)"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      style={{
                        width: "300px",
                        padding: "12px",
                        border: "2px solid #0068dfff",
                        borderRadius: "8px",
                        fontSize: "16px",
                        outline: "none",
                        transition: "border-color 0.3s",
                        textAlign: "center"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#004798ff")}
                      onBlur={(e) => (e.target.style.borderColor = "#0068dfff")}
                    />
                  </div>
                )}

                {gameState.players.length >= 2 && !isCreator && (
                  <p className="modeChange" style={{ fontSize: "14px", color: "#999" }}>
                    Only the room creator can start the voting session
                  </p>
                )}
              </div>
            )}

            {currentGameState === "voting" && (
              <div style={{ textAlign: "center" }}>
                <p className="modeChange" style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}>
                  {gameState.players.filter(p => p.hasVoted).length} of {gameState.players.length} participants have voted
                </p>
                {vote && (
                  <p className="modeChange" style={{ fontSize: "14px", color: "#28a745", fontWeight: "bold" }}>
                    Your vote: {vote}
                  </p>
                )}
              </div>
            )}

            {currentGameState === "revealed" && (
              <div style={{ textAlign: "center" }}>
                <h3 className="modeChange" style={{ color: "#28a745", marginBottom: "30px" }}>
                  All Votes Revealed!
                </h3>

                {/* Display All Votes */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "15px",
                    maxWidth: "600px",
                    margin: "20px auto"
                  }}
                >
                  {gameState.players.map((player, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "15px",
                        backgroundColor: player.username === username ? "#f0f8ff" : "white",
                        border: player.username === username ? "2px solid #0068dfff" : "1px solid #e0e0e0",
                        borderRadius: "12px",
                        minWidth: "120px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      {/* Player Avatar */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: player.username === username ? "#0068dfff" : "#51b1ffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "10px"
                        }}
                      >
                        {player.username.charAt(0).toUpperCase()}
                      </div>

                      {/* Player Name */}
                      <div
                        className="modeChange"
                        style={{
                          fontSize: "14px",
                          fontWeight: player.username === username ? "600" : "500",
                          color: player.username === username ? "#004798ff" : "#333",
                          marginBottom: "8px",
                          textAlign: "center"
                        }}
                      >
                        {player.username}
                        {player.username === username && (
                          <span style={{ color: "#51b1ffff" }}> (You)</span>
                        )}
                      </div>

                      {/* Vote Display */}
                      <div
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#0068dfff",
                          color: "white",
                          borderRadius: "6px",
                          fontSize: "18px",
                          fontWeight: "bold",
                          minWidth: "40px",
                          textAlign: "center"
                        }}
                      >
                        {player.vote !== null && player.vote !== undefined ? player.vote : "?"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show Average if there are numeric votes */}
                {averageResult && (
                  <div
                    style={{
                      marginTop: "30px",
                      padding: "15px 25px",
                      backgroundColor: "#f0f8ff",
                      border: "2px solid #0068dfff",
                      borderRadius: "10px",
                      display: "inline-block"
                    }}
                  >
                    <h4 className="modeChange" style={{ color: "#004798ff", margin: "0" }}>
                      Average: {averageResult}
                    </h4>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voting Cards */}
          <VotingCards
            cards={cardsToDisplay}
            selectedCard={vote}
            onCardSelect={handleVote}
            gameState={currentGameState}
            disabled={currentGameState !== "voting"}
          />
        </div>

        {/* Users List */}
        <div
          style={{
            width: "300px",
            borderLeft: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa"
          }}
        >
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