import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home"; // lowercase is correct
import Login from "./components/Login";
import Registration from "./components/Registration";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
import AdminTrains from "./components/AdminTrains";

import SearchTrain from "./components/Searchtrain";
import RouteMap from "./components/RouteMap";
import LiveStatus from "./components/Livestatus";
import StationBoard from "./components/StationBoard";
import JourneyPlanner from "./components/JourneyPlanner";
import Help from "./components/Help";

import "./styles/main.css";

function App() {
  return (
    <Router>

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin" element={<Admin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/trains" element={<AdminTrains />} />



        {/* MAIN FEATURES */}
        <Route path="/search" element={<SearchTrain />} />
        <Route path="/route-map" element={<RouteMap />} />
        <Route path="/live-status" element={<LiveStatus />} />
        <Route path="/station-board" element={<StationBoard />} />
        <Route path="/journey-planner" element={<JourneyPlanner />} />

        {/* HELP */}
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
