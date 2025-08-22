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
      <div style={{ borderBottom: "1px solid #0068dfff" }}>
        <Navbar />
      </div>
      <div
        style={{
          width: "100%",
          height: "85vh",
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h1
          className="modeChange"
          style={{
            color: "#004798ff",
            fontSize: "50px",
            textAlign: "center",
          }}
        >
          Welcome to Planning Poker!!
        </h1>

        <h2 className={`slide-text ${fade ? "slide-in" : "slide-out"}`}
          style={{
            color: "#51b1ffff",
            fontSize: "26px",
            fontStyle: "italic",
          }}
        >
          {message[index]}
        </h2>
      
        <h2
          className="modeChange"
          style={{
            color: '#004798ff',
            fontSize: '20px',
            margin: '5px',
            fontWeight: '600'
          }}
        >
          Start a new session
        </h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
              width: "300px",
              padding: "12px",
              border: "2px solid #0068dfff",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.3s",
              margin: "0 auto",
            }}
        />
        <button
          onClick={handleStart}
          style={{
            width: "200px",
            height: "50px",
            margin: "10px",
            fontSize: "18px",
            fontWeight: "600",
            color: "white",
            backgroundColor: "#0068dfff",
            border: "none",
            cursor: 'pointer',
            borderRadius: "8px"
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#004798ff')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#0068dfff')}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
