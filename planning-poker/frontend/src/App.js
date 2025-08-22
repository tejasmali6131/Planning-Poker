import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import CreateRoom from "./pages/CreateRoom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </Router>
  );
}

export default App;
