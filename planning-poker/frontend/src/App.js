import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import CreateRoom from "./pages/CreateRoom";
import JoinGame from "./pages/JoinGame";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/game/:gameId/join" element={<JoinGame />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={1000} />
      </>
    </Router>
  );
}

export default App;
