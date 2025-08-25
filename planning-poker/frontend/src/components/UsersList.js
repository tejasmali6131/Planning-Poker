import React from "react";

export default function UsersList({ players, currentUsername, gameState }) {
    return (
        <div className="users-list-container">
            <div className="users-list-header">
                <h3
                    className="modeChange"
                    style={{
                        margin: "0 0 15px 0",
                        fontSize: "18px",
                        color: "#004798ff"
                    }}
                >
                    Participants ({players.length})
                </h3>
            </div>

            <div className="users-list-content">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {players.map((player, index) => {
                        const hasVoted = player.hasVoted || (player.vote !== null && player.vote !== undefined);
                        const isCurrentUser = player.username === currentUsername;

                        return (
                            <div
                                key={index}
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
                                        {player.username.charAt(0).toUpperCase()}
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
                                            {player.username}
                                            {isCurrentUser && <span style={{ color: "#51b1ffff" }}> (You)</span>}
                                        </div>
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

                                    {gameState === "revealed" && player.vote !== null && player.vote !== undefined && (
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
                                            {player.vote}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
