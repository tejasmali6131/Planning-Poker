import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // Load username from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  function handleCreateRoom() {
    if (username.trim() === '') {
      alert('Please enter a username');
      return;
    }

    // Store username in localStorage
    localStorage.setItem('username', username);
    navigate('/create-room');
  }

  function handleJoinRoom() {
    if (username.trim() === '') {
      alert('Please enter a username');
      return;
    }

    if (roomCode.trim() === '' || roomCode.length !== 6) {
      alert('Please enter a valid 6-digit room code');
      return;
    }

    // Store username in localStorage
    localStorage.setItem('username', username);
    navigate(`/game/${roomCode}`);
  }

  return (
    <div>
      <div style={{ borderBottom: '1px solid #0068dfff' }}>
        <Navbar />
      </div>

      <h1
        className="modeChange"
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#004798ff',
          fontSize: '36px',
          textAlign: 'center',
        }}
      >
        Welcome to Planning Poker!!
      </h1>
      <h2
        className="modeChange"
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#51b1ffff',
          fontSize: '20px',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Estimate with your team in real-time
      </h2>

      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter Username"
          style={{
            width: '300px',
            padding: '12px',
            border: '2px solid #0068dfff',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s',
            margin: '0 auto',
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = '#004798ff')}
          onBlur={(e) => (e.target.style.borderColor = '#0068dfff')}
        />

        {/* Room Actions - Side by Side */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '50px',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          {/* Create Room Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            flex: '1',
            minWidth: '250px'
          }}>
            <h3
              className="modeChange"
              style={{
                color: '#004798ff',
                fontSize: '18px',
                margin: '0',
                fontWeight: '600'
              }}
            >
              Start New Session
            </h3>
            <button
              onClick={handleCreateRoom}
              style={{
                width: '200px',
                height: '45px',
                fontSize: '16px',
                color: 'white',
                backgroundColor: '#0068dfff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#004798ff')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#0068dfff')}
            >
              Create New Room
            </button>
          </div>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '120px',
            backgroundColor: '#e0e0e0',
            alignSelf: 'center'
          }}></div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            alignSelf: 'center'
          }}>
            <span className="modeChange" style={{ color: '#666', fontSize: '14px' }}>or</span>
          </div>

          <div style={{
            width: '1px',
            height: '120px',
            backgroundColor: '#e0e0e0',
            alignSelf: 'center'
          }}></div>

          {/* Join Room Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            flex: '1',
            minWidth: '250px'
          }}>
            <h3
              className="modeChange"
              style={{
                color: '#004798ff',
                fontSize: '18px',
                margin: '0',
                fontWeight: '600'
              }}
            >
              Join Existing Room
            </h3>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit room code"
              maxLength="6"
              style={{
                width: '200px',
                padding: '12px',
                border: '2px solid #51b1ffff',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                textAlign: 'center',
                letterSpacing: '2px',
              }}
              value={roomCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                setRoomCode(value);
              }}
              onFocus={(e) => (e.target.style.borderColor = '#004798ff')}
              onBlur={(e) => (e.target.style.borderColor = '#51b1ffff')}
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomCode.length !== 6}
              style={{
                width: '200px',
                height: '45px',
                fontSize: '16px',
                color: roomCode.length === 6 ? 'white' : '#999',
                backgroundColor: roomCode.length === 6 ? '#51b1ffff' : '#e0e0e0',
                border: 'none',
                borderRadius: '8px',
                cursor: roomCode.length === 6 ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.3s',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                if (roomCode.length === 6) {
                  e.target.style.backgroundColor = '#4a9eff';
                }
              }}
              onMouseLeave={(e) => {
                if (roomCode.length === 6) {
                  e.target.style.backgroundColor = '#51b1ffff';
                }
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
