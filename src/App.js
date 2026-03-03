import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import AdminDashboard from "./components/AdminDashboard";
import AdminTrains from "./components/AdminTrains";
import TrackTrains from "./pages/TrackTrains";
import RouteMap from "./components/RouteMap";
import LiveStatus from "./components/Livestatus";
import StationBoard from "./components/StationBoard";
import Help from "./components/Help";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import Toast from "./components/Toast";
import { ToastProvider } from "./contexts/ToastContext";
import { SearchProvider } from "./contexts/SearchContext";

import "./styles/main.css";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SearchProvider>
          <Router>
            <Toast />
            <Routes>
              {/* ALL PAGES WITH NAVBAR */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/route-map" element={<RouteMap />} />
                <Route path="/track-trains" element={<TrackTrains />} />
                <Route path="/live-status" element={<LiveStatus />} />
                <Route path="/station-board" element={<StationBoard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/trains" element={<AdminTrains />} />
                <Route path="/help" element={<Help />} />
              </Route>

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/trains" element={<AdminTrains />} />

              {/* 404 NOT FOUND */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SearchProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
