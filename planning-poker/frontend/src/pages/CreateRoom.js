import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Navbar from "../components/Navbar";
import './CreateRoom.css';

const DECK_TYPES = {
    FIBONACCI: {
        name: "Fibonacci",
        cards: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "65", "?"]
    },
    MODIFIED_FIBONACCI: {
        name: "Modified Fibonacci",
        cards: ["0", "½", "1", "2", "3", "5", "8", "13", "20", "40", "?"]
    }
};

export default function CreateRoom() {
    const [roomName, setRoomName] = useState("");
    const [selectedDeck, setSelectedDeck] = useState("FIBONACCI");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            navigate("/");
            return;
        }
    }, [navigate]);

    const handleCreateRoom = async () => {
        if (roomName.trim() === "") {
            alert("Please enter a room name");
            return;
        }

        setIsCreating(true);

        // Generate unique room ID using uuid for compatibility with existing backend
        const gameId = uuidv4().slice(0, 6);
        const username = localStorage.getItem("username");

        // Store room configuration in localStorage for later use
        localStorage.setItem(`room_${gameId}`, JSON.stringify({
            name: roomName,
            deckType: selectedDeck,
            cards: DECK_TYPES[selectedDeck].cards,
            createdBy: username,
            createdAt: new Date().toISOString()
        }));

        // Navigate to the game room
        setTimeout(() => {
            navigate(`/game/${gameId}`);
        }, 500);
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div>
            <div className="create-room-navbar">
                <Navbar />
            </div>

            <div className="create-room-container">
                <h1
                    className="modeChange create-room-title"
                >
                    Create Planning Room
                </h1>

                <div className="form-field">
                    <label
                        className="modeChange form-label"
                    >
                        Room Name *
                    </label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                        placeholder="Enter room name (e.g., Sprint Planning)"
                        className="room-name-input"
                    />
                </div>

                <div className="deck-type-section">
                    <label
                        className="modeChange deck-type-label"
                    >
                        Deck Type
                    </label>

                    {Object.entries(DECK_TYPES).map(([key, deck]) => (
                        <div
                            key={key}
                            className={`deck-option ${selectedDeck === key ? 'selected' : ''}`}
                            onClick={() => setSelectedDeck(key)}
                        >
                            <div className="deck-option-header">
                                <input
                                    type="radio"
                                    checked={selectedDeck === key}
                                    onChange={() => setSelectedDeck(key)}
                                    className="deck-radio"
                                />
                                <span
                                    className={`modeChange deck-name ${selectedDeck === key ? 'selected' : ''}`}
                                >
                                    {deck.name}
                                </span>
                            </div>
                            <div className="deck-cards-preview">
                                {deck.cards.map((card, index) => (
                                    <span
                                        key={index}
                                        className={`deck-card ${selectedDeck === key ? 'selected' : ''}`}
                                    >
                                        {card}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button-container">
                    <button
                        onClick={handleBack}
                        className="back-btn"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleCreateRoom}
                        disabled={isCreating || roomName.trim() === ""}
                        className="create-room-btn"
                    >
                        {isCreating ? "Creating..." : "Create Room"}
                    </button>
                </div>
            </div>
        </div>
    );
}
