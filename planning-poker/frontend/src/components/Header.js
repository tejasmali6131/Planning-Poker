import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Header({ showCopyButton, copyLink }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <h1>Planning Poker</h1>
      
      <div>
        {showCopyButton && (
          <button onClick={copyLink}>📋 Copy Link</button>
        )}
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
