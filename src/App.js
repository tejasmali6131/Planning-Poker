import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CreateRoom from "./components/CreateRoom";
import PlanningRoom from "./components/PlanningRoom";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/room/:roomId" element={<PlanningRoom />} />
            </Routes>
        </Router>
    )
}