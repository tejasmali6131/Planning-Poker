import React from "react";

export default function VotingCards({ cards, selectedCard, onCardSelect, gameState, disabled }) {
    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "white",
                borderTop: "1px solid #e0e0e0",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <h3
                className="modeChange"
                style={{
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    color: "#004798ff",
                    textAlign: "center"
                }}
            >
                {gameState === "voting" ? "Choose your estimate:" : "Estimation Cards"}
            </h3>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    maxWidth: "800px",
                    margin: "0 auto"
                }}
            >
                {cards.map((card, index) => {
                    const isSelected = selectedCard === card;
                    const isClickable = !disabled && gameState === "voting";

                    return (
                        <button
                            key={index}
                            onClick={() => isClickable && onCardSelect(card)}
                            disabled={disabled}
                            style={{
                                width: "60px",
                                height: "80px",
                                borderRadius: "8px",
                                border: isSelected ? "3px solid #0068dfff" : "2px solid #e0e0e0",
                                backgroundColor: isSelected
                                    ? "#f0f8ff"
                                    : disabled
                                        ? "#f8f9fa"
                                        : "white",
                                color: disabled ? "#999" : isSelected ? "#0068dfff" : "#333",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: isClickable ? "pointer" : "not-allowed",
                                transition: "all 0.3s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: isSelected
                                    ? "0 4px 12px rgba(0, 104, 223, 0.3)"
                                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                                transform: isSelected ? "scale(1.05)" : "scale(1)",
                                opacity: disabled ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (isClickable && !isSelected) {
                                    e.target.style.backgroundColor = "#f8f9fa";
                                    e.target.style.borderColor = "#51b1ffff";
                                    e.target.style.transform = "scale(1.02)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isClickable && !isSelected) {
                                    e.target.style.backgroundColor = "white";
                                    e.target.style.borderColor = "#e0e0e0";
                                    e.target.style.transform = "scale(1)";
                                }
                            }}
                        >
                            {card === "∞" ? "∞" : card === "?" ? "?" : card}
                        </button>
                    );
                })}
            </div>

            {/* Status Message */}
            <div
                style={{
                    marginTop: "15px",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#666"
                }}
            >
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
        return "Click on a card to make your estimate";
    }

    if (gameState === "revealed") {
        return "Voting round completed";
    }

    return "";
}
