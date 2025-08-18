import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UsersList from "./UsersList";
import VotingCards from "./VotingCards";
import GameArea from "./GameArea";
import { RoomStorage } from "../utils/RoomStorage";

export default function PlanningRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // State management
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [gameState, setGameState] = useState("waiting"); // waiting, voting, revealed
    const [votes, setVotes] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [averageResult, setAverageResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create a demo room for testing when room is not found
    const createDemoRoom = (roomId, username) => {
        const demoRoom = {
            id: roomId,
            name: `Demo Room ${roomId}`,
            deckType: "FIBONACCI",
            cards: ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "∞", "?"],
            createdBy: username,
            createdAt: new Date().toISOString(),
            users: [],
            gameState: "waiting",
            votes: {},
            isStarted: false
        };

        // Save the demo room
        RoomStorage.saveRoom(roomId, demoRoom);
        return demoRoom;
    };

    // Simulate socket connection (replace with actual socket.io later)
    const simulateSocketConnection = useCallback((roomData, user) => {
        // This would be replaced with actual socket.io connection
        console.log("Connected to room:", roomId);
        console.log("User joined:", user);
    }, [roomId]);    // Initialize room and user
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            navigate("/");
            return;
        }

        // Load room data using RoomStorage utility
        const roomData = RoomStorage.getRoom(roomId);

        if (!roomData) {
            // Try to create a demo room if none exists (for testing purposes)
            const demoRoom = createDemoRoom(roomId, username);
            if (demoRoom) {
                setRoom(demoRoom);
                console.log("Created demo room for testing:", roomId);
            } else {
                setError("Room not found. Please check the room code or create a new room.");
                setIsLoading(false);
                return;
            }
        } else {
            setRoom(roomData);
        }

        const currentRoomData = roomData || createDemoRoom(roomId, username);

        // Create or get current user
        const userId = `${username}_${Date.now()}`;
        const user = {
            id: userId,
            username: username,
            hasVoted: false,
            isCreator: currentRoomData.createdBy === username
        };

        setCurrentUser(user);

        // Add user to room if not already present
        const existingUserIndex = currentRoomData.users.findIndex(u => u.username === username);
        if (existingUserIndex === -1) {
            currentRoomData.users.push(user);
        } else {
            currentRoomData.users[existingUserIndex] = user;
        }

        setUsers(currentRoomData.users);
        setGameState(currentRoomData.gameState || "waiting");
        setVotes(currentRoomData.votes || {});

        // Update room in storage using RoomStorage utility
        RoomStorage.saveRoom(roomId, currentRoomData);

        setIsLoading(false);

        // Simulate socket connection for demo (replace with actual socket.io later)
        simulateSocketConnection(currentRoomData, user);

    }, [roomId, navigate, simulateSocketConnection]);

    const handleCardSelect = (cardValue) => {
        if (gameState !== "voting") {
            alert("Voting hasn't started yet!");
            return;
        }

        setSelectedCard(cardValue);

        // Update votes
        const newVotes = { ...votes };
        newVotes[currentUser.id] = {
            userId: currentUser.id,
            username: currentUser.username,
            vote: cardValue
        };
        setVotes(newVotes);

        // Update user status
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? { ...user, hasVoted: true } : user
        );
        setUsers(updatedUsers);

        // Update room in storage using RoomStorage
        RoomStorage.updateRoom(roomId, {
            votes: newVotes,
            users: updatedUsers
        });

        // Check if all users have voted
        checkAllVoted(updatedUsers, newVotes);
    };

    const checkAllVoted = (userList, voteList) => {
        // Filter to only include users who should be voting (all users in the room)
        const votingUsers = userList.filter(user => user.id);

        // Check if all users have voted
        const allVoted = votingUsers.length > 0 && votingUsers.every(user => voteList[user.id]);

        if (allVoted && votingUsers.length > 0) {
            // All users have voted - enable reveal button
            setShowResults(true);
        }
    };

    const handleStartVoting = () => {
        setGameState("voting");
        setVotes({});
        setSelectedCard(null);
        setShowResults(false);
        setAverageResult(null);

        // Reset all users' voting status
        const updatedUsers = users.map(user => ({ ...user, hasVoted: false }));
        setUsers(updatedUsers);

        // Update room in storage using RoomStorage
        RoomStorage.updateRoom(roomId, {
            gameState: "voting",
            votes: {},
            users: updatedUsers
        });
    };

    const handleRevealVotes = () => {
        setGameState("revealed");

        // Calculate average (only for numeric cards)
        const numericVotes = Object.values(votes)
            .map(vote => vote.vote)
            .filter(vote => !isNaN(parseFloat(vote)) && isFinite(vote))
            .map(vote => parseFloat(vote));

        if (numericVotes.length > 0) {
            const average = numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length;

            // Find closest card to average
            const numericCards = room.cards
                .filter(card => !isNaN(parseFloat(card)) && isFinite(card))
                .map(card => parseFloat(card));

            if (numericCards.length > 0) {
                const closestCard = numericCards.reduce((closest, card) =>
                    Math.abs(card - average) < Math.abs(closest - average) ? card : closest
                );

                setAverageResult({
                    average: average.toFixed(1),
                    closestCard: closestCard.toString()
                });
            } else {
                setAverageResult({
                    average: average.toFixed(1),
                    closestCard: null
                });
            }
        }

        // Update room in storage using RoomStorage
        RoomStorage.updateRoom(roomId, {
            gameState: "revealed"
        });
    };

    const handleNewRound = () => {
        setGameState("waiting");
        setVotes({});
        setSelectedCard(null);
        setShowResults(false);
        setAverageResult(null);

        // Reset all users' voting status
        const updatedUsers = users.map(user => ({ ...user, hasVoted: false }));
        setUsers(updatedUsers);

        // Update room in storage using RoomStorage
        RoomStorage.updateRoom(roomId, {
            gameState: "waiting",
            votes: {},
            users: updatedUsers
        });
    };

    const copyRoomLink = () => {
        const roomLink = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard.writeText(roomLink).then(() => {
            alert("Room link copied to clipboard!");
        });
    };

    if (isLoading) {
        return (
            <div>
                <div style={{ borderBottom: "1px solid #0068dfff" }}>
                    <Navbar />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "400px",
                        fontSize: "18px",
                        color: "#0068dfff"
                    }}
                >
                    Loading room...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div style={{ borderBottom: "1px solid #0068dfff" }}>
                    <Navbar />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "400px",
                        gap: "20px"
                    }}
                >
                    <div style={{ fontSize: "24px", color: "#ff4444" }}>
                        {error}
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            padding: "12px 24px",
                            fontSize: "16px",
                            color: "white",
                            backgroundColor: "#0068dfff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

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
                        {room.name}
                    </h1>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <span
                            className="modeChange"
                            style={{ color: "#666", fontSize: "14px" }}
                        >
                            Room Code: <strong style={{ color: "#0068dfff", fontSize: "16px" }}>{roomId}</strong>
                        </span>
                        <span
                            className="modeChange"
                            style={{ color: "#666", fontSize: "14px" }}
                        >
                            Deck: {room.cards.join(", ")}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={copyRoomLink}
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

                    {currentUser?.isCreator && (
                        <>
                            {gameState === "waiting" && (
                                <button
                                    onClick={handleStartVoting}
                                    disabled={users.length < 2}
                                    style={{
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                        color: "white",
                                        backgroundColor: users.length < 2 ? "#ccc" : "#28a745",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: users.length < 2 ? "not-allowed" : "pointer",
                                        transition: "background-color 0.3s"
                                    }}
                                >
                                    Start Voting
                                </button>
                            )}

                            {gameState === "voting" && showResults && (
                                <button
                                    onClick={handleRevealVotes}
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
                                    Reveal Votes
                                </button>
                            )}

                            {gameState === "revealed" && (
                                <button
                                    onClick={handleNewRound}
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
                    <GameArea
                        gameState={gameState}
                        votes={votes}
                        users={users}
                        currentUser={currentUser}
                        averageResult={averageResult}
                        showResults={showResults}
                    />

                    {/* Voting Cards */}
                    <VotingCards
                        cards={room.cards}
                        selectedCard={selectedCard}
                        onCardSelect={handleCardSelect}
                        gameState={gameState}
                        disabled={gameState !== "voting"}
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
                        users={users}
                        currentUser={currentUser}
                        votes={votes}
                        gameState={gameState}
                    />
                </div>
            </div>
        </div>
    );
}
