import React from "react";

export default function UsersList({ users, currentUser, votes, gameState }) {
    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div
                style={{
                    padding: "20px",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "white"
                }}
            >
                <h3
                    className="modeChange"
                    style={{
                        margin: "0 0 15px 0",
                        fontSize: "18px",
                        color: "#004798ff"
                    }}
                >
                    Participants ({users.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {users.map((user) => {
                        const hasVoted = votes[user.id] !== undefined;
                        const isCurrentUser = user.id === currentUser?.id;

                        return (
                            <div
                                key={user.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "12px",
                                    backgroundColor: isCurrentUser ? "#f0f8ff" : "white",
                                    border: isCurrentUser ? "2px solid #0068dfff" : "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    transition: "all 0.3s"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    {/* User Avatar */}
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            backgroundColor: isCurrentUser ? "#0068dfff" : "#51b1ffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <div
                                            className="modeChange"
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: isCurrentUser ? "600" : "500",
                                                color: isCurrentUser ? "#004798ff" : "#333"
                                            }}
                                        >
                                            {user.username}
                                            {isCurrentUser && <span style={{ color: "#51b1ffff" }}> (You)</span>}
                                        </div>
                                        {user.isCreator && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#ffc107",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                Room Creator
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Voting Status */}
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {gameState === "voting" && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: hasVoted ? "#28a745" : "#e0e0e0",
                                                transition: "background-color 0.3s"
                                            }}
                                        >
                                            {hasVoted ? (
                                                <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                                            ) : (
                                                <span style={{ color: "#999", fontSize: "12px" }}>⏱</span>
                                            )}
                                        </div>
                                    )}

                                    {gameState === "revealed" && votes[user.id] && (
                                        <div
                                            style={{
                                                padding: "4px 8px",
                                                backgroundColor: "#0068dfff",
                                                color: "white",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                minWidth: "24px",
                                                textAlign: "center"
                                            }}
                                        >
                                            {votes[user.id].vote}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Game Status */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "white",
                    borderBottom: "1px solid #e0e0e0"
                }}
            >
                <h4
                    className="modeChange"
                    style={{
                        margin: "0 0 10px 0",
                        fontSize: "16px",
                        color: "#004798ff"
                    }}
                >
                    Game Status
                </h4>

                <div
                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: getGameStatusColor(gameState),
                        color: "white",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >
                    {getGameStatusText(gameState, users.length)}
                </div>

                {gameState === "voting" && (
                    <div
                        style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#666",
                            textAlign: "center"
                        }}
                    >
                        {Object.keys(votes).length} / {users.length} voted
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    backgroundColor: "#f8f9fa"
                }}
            >
                <h4
                    className="modeChange"
                    style={{
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                        color: "#666",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }}
                >
                    Instructions
                </h4>

                <div
                    className="modeChange"
                    style={{
                        fontSize: "13px",
                        color: "#666",
                        lineHeight: "1.4"
                    }}
                >
                    {getInstructions(gameState, currentUser?.isCreator)}
                </div>
            </div>
        </div>
    );
}

function getGameStatusColor(gameState) {
    switch (gameState) {
        case "waiting":
            return "#6c757d";
        case "voting":
            return "#ffc107";
        case "revealed":
            return "#28a745";
        default:
            return "#6c757d";
    }
}

function getGameStatusText(gameState, userCount) {
    switch (gameState) {
        case "waiting":
            return userCount < 2 ? "Waiting for players..." : "Ready to start voting";
        case "voting":
            return "Voting in progress...";
        case "revealed":
            return "Votes revealed";
        default:
            return "Unknown status";
    }
}

function getInstructions(gameState, isCreator) {
    switch (gameState) {
        case "waiting":
            if (isCreator) {
                return "As the room creator, you can start voting once at least 2 participants have joined. Share the room link to invite others.";
            }
            return "Waiting for the room creator to start voting. Make sure everyone who needs to participate has joined the room.";

        case "voting":
            return "Choose your estimation from the cards below. Your vote will remain hidden until everyone has voted and the results are revealed.";

        case "revealed":
            if (isCreator) {
                return "All votes have been revealed. Review the results and start a new round when ready to estimate the next item.";
            }
            return "All votes have been revealed. The room creator can start a new round for the next estimation.";

        default:
            return "Welcome to Planning Poker! Follow the instructions above to participate in the estimation process.";
    }
}
