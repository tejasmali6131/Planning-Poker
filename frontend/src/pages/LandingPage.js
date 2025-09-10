import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";


export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [fade,setFade] = useState(true);
  const [index,setIndex] = useState(0);
  const navigate = useNavigate();

  const message = [
    "We plan together, we win together...",
    "Every point counts when the team counts...",
    "Collaboration is the real currency...",
    "Estimate smart, deliver smarter...",
    "Turn uncertainty into clarity..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % message.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [message.length]);
  
  const handleStart = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    // Save username to localStorage
    localStorage.setItem("username", username);

    navigate(`/create-room`);
  };

  
  return (
    <div>
      <div className="landing-page-navbar">
        <Navbar />
      </div>
      <div className="landing-page-content">
        <h1
          className="modeChange landing-page-title"
        >
          Welcome to Planning Poker!!
        </h1>

        <h2 className={`slide-text landing-page-subtitle ${fade ? "slide-in" : "slide-out"}`}
        >
          {message[index]}
        </h2>
      
        <h2
          className="modeChange session-title"
        >
          Start a new session
        </h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          className="username-input"
        />
        <button
          onClick={handleStart}
          className="submit-btn"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
