import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import CreateRoom from "./pages/CreateRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
