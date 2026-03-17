import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import VotingCards from '../components/VotingCards';
import UsersList from '../components/UsersList';
import apiService from '../services/apiService';
import './GamePage.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [themeToggle, setThemeToggle] = useState(0);

  // Default fibonacci series, will be overridden by room config if available
  const defaultCards = [0, 1, 2, 3, 5, 8, 13, 21, 34, "?"];
  const username = apiService.getUsername();

  useEffect(() => {
    if (!username) {
      navigate(`/game/${gameId}/join`);
      return;
    }

    // Load room configuration if available
    const config = apiService.loadRoomConfig(gameId);
    if (config) {
      setRoomConfig(config);
    }

    // Always emit joinGame - backend will handle duplicates intelligently
    apiService.joinGame(gameId, username);

    apiService.onGameStateUpdate((state) => {
      setGameState(state);
    });

    apiService.onGameRestarted(() => {
      setVote(null);
    });

    return () => {
      apiService.removeGameStateListener();
      apiService.removeGameRestartListener();
    };
  }, [gameId, username, navigate]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Trigger re-render when theme changes
      setThemeToggle(prev => prev + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const handleCopyLink = async () => {
    // Generate the current page URL directly
    const gameLink = `${window.location.origin}/game/${gameId}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(gameLink);
        toast.success("Game link copied to clipboard!");
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = gameLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        if (document.execCommand) {
          document.execCommand('copy');
        }
        
        document.body.removeChild(textArea);
        toast.success("Game link copied to clipboard!");
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error("Failed to copy link. Please copy manually: " + gameLink);
    }
  };

  const handleVote = (num) => {
    setVote(num);
    apiService.submitVote(gameId, username, num);
  };

  const handleReveal = () => {
    apiService.revealVotes(gameId);
  };

  const handleRestart = () => {
    apiService.restartGame(gameId);
    setVote(null);
    setTopicInput("");
  };

  const handleStartGame = () => {
    // Send the topic to the backend instead of setting it locally
    apiService.startGame(gameId, username, topicInput);
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

  // Calculate vote statistics when revealed
  const voteStats = useMemo(() => {
    if (!gameState.revealed) return null;

    const numericVotes = gameState.players
      .map(p => p.vote)
      .filter(v => v !== null && v !== undefined && v !== "?" && !isNaN(v))
      .map(v => typeof v === 'string' ? parseFloat(v) : v);

    if (numericVotes.length === 0) return null;

    // Calculate vote distribution
    const voteCounts = {};
    gameState.players.forEach(player => {
      const vote = player.vote;
      if (vote !== null && vote !== undefined) {
        const voteKey = String(vote);
        voteCounts[voteKey] = (voteCounts[voteKey] || 0) + 1;
      }
    });

    // Calculate average
    const sum = numericVotes.reduce((acc, v) => acc + v, 0);
    const average = sum / numericVotes.length;

    // Find closest Fibonacci number
    const fibonacciSequence = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    const closestFib = fibonacciSequence.reduce((prev, curr) => 
      Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev
    );

    return {
      voteCounts,
      average: average.toFixed(1),
      closestFibonacci: closestFib,
      totalVotes: gameState.players.length,
      numericVotesCount: numericVotes.length
    };
  }, [gameState.revealed, gameState.players]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!voteStats) return null;

    const labels = Object.keys(voteStats.voteCounts);
    const data = Object.values(voteStats.voteCounts);

    // Generate colors for each vote option
    const backgroundColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF'
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: 'Votes',
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [voteStats]);

  const chartOptions = useMemo(() => {
    // Get the current text color from CSS variables
    // themeToggle triggers recalculation when theme changes
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#333333';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            font: {
              size: 14
            },
            padding: 15,
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const percentage = ((value / voteStats?.totalVotes || 1) * 100).toFixed(0);
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    fontColor: textColor,
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: textColor,
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const percentage = ((value / voteStats?.totalVotes || 1) * 100).toFixed(1);
              return `${label}: ${value} votes (${percentage}%)`;
            }
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteStats, themeToggle]);

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
                  Start Session
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

                {/* Vote Distribution Pie Chart and Closest Fibonacci */}
                {voteStats && chartData && (
                  <div className="vote-statistics">
                    <div className="statistics-header">
                      <h4 className="modeChange statistics-title">Vote Distribution</h4>
                      <div className="closest-fibonacci">
                        <span className="modeChange fibonacci-label">Suggested Estimate:</span>
                        <span className="fibonacci-value">{voteStats.closestFibonacci}</span>
                        <span className="modeChange average-detail">(avg: {voteStats.average})</span>
                      </div>
                    </div>
                    
                    <div className="chart-container">
                      <Pie data={chartData} options={chartOptions} />
                    </div>
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