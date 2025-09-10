import React from "react";
import "./UsersList.css";

export default function UsersList({ players, currentUsername, gameState }) {
    return (
        <div className="users-list-container">
            <div className="users-list-header">
                <h3 className="users-list-title">
                    Participants ({players.length})
                </h3>
            </div>

            <div className="users-list-content">
                <div className="users-grid">
                    {players.map((player, index) => {
                        const hasVoted = player.hasVoted || (player.vote !== null && player.vote !== undefined);
                        const isCurrentUser = player.username === currentUsername;

                        return (
                            <div
                                key={index}
                                className={`user-card ${isCurrentUser ? 'current-user' : ''}`}
                            >
                                <div className="user-info">
                                    {/* User Avatar */}
                                    <div className={`user-avatar ${isCurrentUser ? 'current-user' : ''}`}>
                                        {player.username.charAt(0).toUpperCase()}
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <div className={`user-name ${isCurrentUser ? 'current-user' : ''}`}>
                                            {player.username}
                                            {isCurrentUser && <span className="you-indicator"> (You)</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Voting Status */}
                                <div className="voting-status">
                                    {gameState === "voting" && (
                                        <div className={`status-indicator ${hasVoted ? 'voted' : 'waiting'}`}>
                                            {hasVoted ? "✓" : "⏱"}
                                        </div>
                                    )}

                                    {gameState === "revealed" && player.vote !== null && player.vote !== undefined && (
                                        <div className="vote-badge">
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
