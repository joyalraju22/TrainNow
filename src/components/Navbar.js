  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

  import Home from "./components/home";
  import Login from "./components/Login";
  import Registration from "./components/Registration";
  import SearchTrain from "./components/Searchtrain";
  import RouteMap from "./components/RouteMap";
  import StationBoard from "./components/StationBoard";
  import JourneyPlanner from "./components/JourneyPlanner";
  import Help from "./components/Help";

  import "./styles/main.css";

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          <Route path="/search" element={<SearchTrain />} />
          <Route path="/route-map" element={<RouteMap />} />
          <Route path="/station-board" element={<StationBoard />} />
          <Route path="/journey-planner" element={<JourneyPlanner />} />


          <Route path="/help" element={<Help />} />
        </Routes>
      </Router>
    );
  }

  export default App;
