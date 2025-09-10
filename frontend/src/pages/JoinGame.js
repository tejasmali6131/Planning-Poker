import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { toast } from "react-toastify";
import './JoinGame.css';

export default function JoinGame() {
  const { gameId } = useParams();
  const [joiningUsername, setJoiningUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for username exists error
    socket.on('usernameExists', ({ message }) => {
      toast.error(message);
      // Clear the username input so user can enter a new one
      setJoiningUsername("");
    });

    // Listen for successful join
    socket.on('joinSuccess', ({ gameId }) => {
      // Successfully joined, navigate to the game page
      navigate(`/game/${gameId}`);
    });

    return () => {
      socket.off('usernameExists');
      socket.off('joinSuccess');
    };
  }, [navigate]);

  const handleJoinGame = () => {
    if (!joiningUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem("username", joiningUsername);

    // Emit join game event - we'll navigate only if successful
    socket.emit('joinGame', { gameId, username: joiningUsername });
  };

  return (
    <div className="join-game-page">
        <div className="join-game-navbar">
        <Navbar />
        </div>
        <div className="join-game-content">
        <div className="join-game-card">
            <h2
            className="modeChange join-game-title"
            >
            Join Planning Session
            </h2>
            <p
            className="modeChange join-game-subtitle"
            >
            Room ID: <strong className="room-id-highlight">{gameId}</strong>
            </p>
            <input
            type="text"
            placeholder="Enter your username"
            value={joiningUsername}
            onChange={(e) => setJoiningUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
            className="join-username-input"
            autoFocus
            />
            <button
            onClick={handleJoinGame}
            className="join-game-btn"
            >
            Join Game
            </button>
        </div>
        </div>
    </div>
    );
}