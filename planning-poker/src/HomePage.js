import React from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";

export default function HomePage() {
  const [Username, setUsername] = useState("");

  function handleStartGameBtn() {
    setUsername(Username);

    if (Username.trim() === "") {
      alert("Please enter a username");
      return;
    }

    console.log("Start Game button clicked with username:", Username);
  }

  return (
    <div>
      <div style={{ borderBottom: "1px solid #0068dfff" }}>
        <Navbar />
      </div>

      <h1
        className="modeChange"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#004798ff",
          fontSize: "36px",
        }}
      >
        Welcome to Planning Poker!!
      </h1>
      <h2
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#51b1ffff",
          fontSize: "26px",
          fontStyle: "italic",
        }}
      >
        Quote
      </h2>

      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter Username"
          style={{
            display: "block",
            margin: "10px",
            width: "200px",
            padding: "8px",
            border: "1px solid #0068dfff",
            borderRadius: "4px",
          }}
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <button
          onClick={handleStartGameBtn}
          style={{
            width: "110px",
            height: "40px",
            margin: "10px",
            fontSize: "14px",
            color: "white",
            backgroundColor: "#0068dfff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Start Game →
        </button>
      </div>
    </div>
  );
}
