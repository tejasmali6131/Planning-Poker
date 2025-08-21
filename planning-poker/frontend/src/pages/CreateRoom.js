import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Navbar from "../components/Navbar";

const DECK_TYPES = {
    FIBONACCI: {
        name: "Fibonacci",
        cards: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "65", "?"]
    },
    MODIFIED_FIBONACCI: {
        name: "Modified Fibonacci",
        cards: ["0", "½", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"]
    }
};

export default function CreateRoom() {
    const [roomName, setRoomName] = useState("");
    const [selectedDeck, setSelectedDeck] = useState("FIBONACCI");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

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
            <div style={{ borderBottom: "1px solid #0068dfff" }}>
                <Navbar />
            </div>

            <div
                style={{
                    maxWidth: "600px",
                    margin: "50px auto",
                    padding: "30px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 104, 223, 0.1)",
                    border: "1px solid #e0e0e0"
                }}
            >
                <h1
                    className="modeChange"
                    style={{
                        color: "#004798ff",
                        fontSize: "28px",
                        marginBottom: "30px",
                        textAlign: "center"
                    }}
                >
                    Create Planning Room
                </h1>

                <div style={{ marginBottom: "25px" }}>
                    <label
                        className="modeChange"
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#333",
                            fontSize: "16px",
                            fontWeight: "500"
                        }}
                    >
                        Room Name *
                    </label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name (e.g., Sprint Planning)"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #0068dfff",
                            borderRadius: "8px",
                            fontSize: "16px",
                            outline: "none",
                            transition: "border-color 0.3s",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#004798ff")}
                        onBlur={(e) => (e.target.style.borderColor = "#0068dfff")}
                    />
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <label
                        className="modeChange"
                        style={{
                            display: "block",
                            marginBottom: "12px",
                            color: "#333",
                            fontSize: "16px",
                            fontWeight: "500"
                        }}
                    >
                        Deck Type
                    </label>

                    {Object.entries(DECK_TYPES).map(([key, deck]) => (
                        <div
                            key={key}
                            style={{
                                marginBottom: "15px",
                                padding: "15px",
                                border: selectedDeck === key ? "2px solid #0068dfff" : "1px solid #e0e0e0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: selectedDeck === key ? "#f0f8ff" : "white",
                                transition: "all 0.3s"
                            }}
                            onClick={() => setSelectedDeck(key)}
                        >
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                <input
                                    type="radio"
                                    checked={selectedDeck === key}
                                    onChange={() => setSelectedDeck(key)}
                                    style={{ marginRight: "10px", transform: "scale(1.2)" }}
                                />
                                <span
                                    className="modeChange"
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        color: selectedDeck === key ? "#004798ff" : "#333"
                                    }}
                                >
                                    {deck.name}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginLeft: "24px" }}>
                                {deck.cards.map((card, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            display: "inline-block",
                                            padding: "4px 8px",
                                            backgroundColor: selectedDeck === key ? "#0068dfff" : "#f5f5f5",
                                            color: selectedDeck === key ? "white" : "#666",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        {card}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                    <button
                        onClick={handleBack}
                        style={{
                            padding: "12px 30px",
                            fontSize: "16px",
                            color: "#666",
                            backgroundColor: "transparent",
                            border: "2px solid #e0e0e0",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f5f5f5";
                            e.target.style.borderColor = "#ccc";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.borderColor = "#e0e0e0";
                        }}
                    >
                        Back
                    </button>

                    <button
                        onClick={handleCreateRoom}
                        disabled={isCreating || roomName.trim() === ""}
                        style={{
                            padding: "12px 30px",
                            fontSize: "16px",
                            color: "white",
                            backgroundColor: isCreating || roomName.trim() === "" ? "#ccc" : "#0068dfff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: isCreating || roomName.trim() === "" ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s",
                            minWidth: "120px"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCreating && roomName.trim() !== "") {
                                e.target.style.backgroundColor = "#004798ff";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCreating && roomName.trim() !== "") {
                                e.target.style.backgroundColor = "#0068dfff";
                            }
                        }}
                    >
                        {isCreating ? "Creating..." : "Create Room"}
                    </button>
                </div>
            </div>
        </div>
    );
}
