import React from "react";

export default function GameArea({ gameState, votes, users, currentUser, averageResult, showResults }) {
    const getVotedUserCards = () => {
        return users
            .filter(user => votes[user.id])
            .map(user => ({
                ...user,
                vote: votes[user.id].vote
            }));
    };

    const votedUsers = getVotedUserCards();
    const totalUsers = users.length;
    const votedCount = votedUsers.length;

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                backgroundColor: "#fafbfc",
                position: "relative"
            }}
        >
            {/* Game State Header */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center"
                }}
            >
                <h2
                    className="modeChange"
                    style={{
                        margin: "0",
                        fontSize: "24px",
                        color: "#004798ff"
                    }}
                >
                    {getGameStateTitle(gameState)}
                </h2>
                {gameState === "voting" && (
                    <p
                        className="modeChange"
                        style={{
                            margin: "5px 0 0 0",
                            fontSize: "16px",
                            color: "#666"
                        }}
                    >
                        {votedCount} of {totalUsers} participants have voted
                    </p>
                )}
            </div>

            {/* Main Content Area */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    width: "100%"
                }}
            >
                {gameState === "waiting" && <WaitingState />}
                {gameState === "voting" && (
                    <VotingState
                        votedUsers={votedUsers}
                        totalUsers={totalUsers}
                        currentUser={currentUser}
                        votes={votes}
                        showResults={showResults}
                    />
                )}
                {gameState === "revealed" && (
                    <RevealedState
                        votes={votes}
                        users={users}
                        averageResult={averageResult}
                    />
                )}
            </div>

            {/* Average Result Display */}
            {averageResult && gameState === "revealed" && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: "center",
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 104, 223, 0.1)",
                        border: "2px solid #0068dfff"
                    }}
                >
                    <div
                        className="modeChange"
                        style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "5px"
                        }}
                    >
                        Average: {averageResult.average}
                    </div>
                    {averageResult.closestCard && (
                        <div
                            style={{
                                fontSize: "24px",
                                color: "#0068dfff",
                                fontWeight: "bold"
                            }}
                        >
                            Suggested: {averageResult.closestCard}
                        </div>
                    )}
                    {!averageResult.closestCard && (
                        <div
                            style={{
                                fontSize: "16px",
                                color: "#666",
                                fontStyle: "italic"
                            }}
                        >
                            (No numeric cards available for suggestion)
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function WaitingState() {
    return (
        <div style={{ textAlign: "center", color: "#666" }}>
            <div
                style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#f0f8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px auto",
                    fontSize: "32px",
                    color: "#0068dfff"
                }}
            >
                ⏳
            </div>
            <h3 className="modeChange" style={{ fontSize: "20px", color: "#004798ff", margin: "0 0 10px 0" }}>
                Ready to Start
            </h3>
            <p style={{ fontSize: "16px", maxWidth: "400px", lineHeight: "1.5" }}>
                Waiting for the room creator to start the voting session.
                Make sure all team members have joined before starting.
            </p>
        </div>
    );
}

function VotingState({ votedUsers, totalUsers, currentUser, votes, showResults }) {
    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            {/* Voting Progress */}
            <div
                style={{
                    marginBottom: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px"
                }}
            >
                <div
                    style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        backgroundColor: votes[currentUser?.id] ? "#28a745" : "#f0f8ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                        color: votes[currentUser?.id] ? "white" : "#0068dfff",
                        border: "3px solid " + (votes[currentUser?.id] ? "#28a745" : "#0068dfff"),
                        transition: "all 0.3s"
                    }}
                >
                    {votes[currentUser?.id] ? "✓" : "?"}
                </div>
            </div>

            {/* Hidden Cards Display */}
            {votedUsers.length > 0 && (
                <div>
                    <h4
                        className="modeChange"
                        style={{
                            fontSize: "16px",
                            color: "#004798ff",
                            marginBottom: "20px"
                        }}
                    >
                        Votes Cast
                    </h4>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            gap: "15px",
                            maxWidth: "600px",
                            margin: "0 auto"
                        }}
                    >
                        {votedUsers.map((user, index) => (
                            <div
                                key={user.id}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        height: "80px",
                                        backgroundColor: user.id === currentUser?.id ? "#0068dfff" : "#6c757d",
                                        borderRadius: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: user.id === currentUser?.id ? "16px" : "24px",
                                        fontWeight: "bold",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    {user.id === currentUser?.id ? user.vote : "?"}
                                </div>
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#666",
                                        maxWidth: "80px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {user.username}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Waiting for votes message */}
            {showResults && (
                <div
                    style={{
                        marginTop: "40px",
                        padding: "20px",
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "8px",
                        color: "#856404",
                        maxWidth: "400px",
                        margin: "40px auto 0 auto"
                    }}
                >
                    <strong>All votes are in!</strong>
                    <br />
                    Waiting for reveal...
                </div>
            )}
        </div>
    );
}

function RevealedState({ votes, users, averageResult }) {
    const votedUsers = users.filter(user => votes[user.id]);

    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            <h3
                className="modeChange"
                style={{
                    fontSize: "20px",
                    color: "#004798ff",
                    marginBottom: "30px"
                }}
            >
                Final Results
            </h3>

            {/* Revealed Cards */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    maxWidth: "800px",
                    margin: "0 auto 40px auto"
                }}
            >
                {votedUsers.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "100px",
                                backgroundColor: "white",
                                border: "2px solid #0068dfff",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0068dfff",
                                fontSize: "20px",
                                fontWeight: "bold",
                                boxShadow: "0 4px 12px rgba(0, 104, 223, 0.2)",
                                animation: "flipIn 0.6s ease-in-out"
                            }}
                        >
                            {votes[user.id].vote}
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#333",
                                fontWeight: "500"
                            }}
                        >
                            {user.username}
                        </div>
                    </div>
                ))}
            </div>

            {/* Statistics */}
            {averageResult && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "40px",
                        flexWrap: "wrap"
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            minWidth: "120px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#0068dfff"
                            }}
                        >
                            {averageResult.average}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            Average
                        </div>
                    </div>

                    <div
                        style={{
                            textAlign: "center",
                            padding: "15px",
                            backgroundColor: "#0068dfff",
                            color: "white",
                            borderRadius: "8px",
                            minWidth: "120px",
                            boxShadow: "0 2px 8px rgba(0, 104, 223, 0.3)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold"
                            }}
                        >
                            {averageResult.closestCard}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                opacity: 0.9,
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            Suggested
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getGameStateTitle(gameState) {
    switch (gameState) {
        case "waiting":
            return "Planning Session";
        case "voting":
            return "Voting in Progress";
        case "revealed":
            return "Results Revealed";
        default:
            return "Planning Poker";
    }
}
