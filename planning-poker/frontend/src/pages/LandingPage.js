import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // Save username to localStorage
    localStorage.setItem('username', username);

    // Create a new game ID
    const gameId = uuidv4();

    // Redirect to game page
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-3xl font-bold mb-6">Set your team points</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-2 border rounded mb-4 w-64 text-center"
      />
      <button
        onClick={handleStart}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Game
      </button>
    </div>
  );
}
