import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import Header from "./components/Header";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
