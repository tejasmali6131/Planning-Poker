import React from "react";
import "./VotingCards.css";

export default function VotingCards({ cards, selectedCard, onCardSelect, gameState, disabled }) {
    return (
        <div className="voting-cards-container">
            <h3 className="voting-cards-title">
                {gameState === "voting" ? "Select a card:" : "Estimation Cards"}
            </h3>

            <div className="cards-grid">
                {cards.map((card, index) => {
                    const isSelected = selectedCard === card;
                    const isClickable = !disabled && gameState === "voting";

                    return (
                        <button
                            key={index}
                            onClick={() => isClickable && onCardSelect(card)}
                            disabled={disabled}
                            className={`voting-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${isClickable ? 'clickable' : ''}`}
                        >
                            {card === "∞" ? "∞" : card === "?" ? "?" : card}
                        </button>
                    );
                })}
            </div>

            {/* Status Message */}
            <div className="voting-status-message">
                {getStatusMessage(gameState, disabled, selectedCard)}
            </div>
        </div>
    );
}

function getStatusMessage(gameState, disabled, selectedCard) {
    if (gameState === "waiting") {
        return "Waiting for voting to start...";
    }

    if (gameState === "voting") {
        if (selectedCard) {
            return `You selected: ${selectedCard}`;
        }
        return "Click on a card to vote";
    }

    if (gameState === "revealed") {
        return "Voting round completed";
    }

    return "";
}