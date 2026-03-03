import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import trainService from "../services/trainService";
import { MdStar, MdStarBorder } from "react-icons/md";
import "./TrackTrains.css";

function TrackTrains() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const to = location.state?.to;
  const trainSearch = location.state?.trainNumber;

  const [trains, setTrains] = useState([]);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteTrains");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setError("");

    if (trainSearch) {
      // Find specific train or trains at station
      trainService.searchTrains(trainSearch)
        .then((data) => setTrains(data))
        .catch((err) => setError(err.message));
    } else if (from && to) {
      trainService.planJourney(from, to)
        .then((data) => setTrains(data))
        .catch((err) => setError(err.message));
    } else {
      setError("No search criteria provided. Please search from home.");
    }
  }, [from, to, trainSearch]);

  const toggleFavorite = (train) => {
    let newFavs;
    const isFav = favorites.some(f => f.number === train.number);
    if (isFav) {
      newFavs = favorites.filter(f => f.number !== train.number);
    } else {
      newFavs = [...favorites, { number: train.number, name: train.name }];
    }
    setFavorites(newFavs);
    localStorage.setItem("favoriteTrains", JSON.stringify(newFavs));
  };

  if (!from && !to && !trainSearch) {
    return (
      <div style={{ padding: "150px", color: "white" }}>
        No search selected. Please return to home.
      </div>
    );
  }


  return (

    <div style={pageStyle} className="track-trains-page">
      <h2 style={titleStyle} className="page-title">
        {trainSearch
          ? `Searching: ${trainSearch}`
          : `Trains from ${from} → ${to}`}
      </h2>

      <p style={subtitleStyle} className="page-subtitle">
        {trains.length} result{trains.length !== 1 ? 's' : ''} found
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {trains.map((train, index) => (
        <div
          key={train.number}
          style={{ ...cardStyle, animationDelay: `${0.2 + (index * 0.1)}s` }}
          className="train-card"
        >

          {/* TOP ROW */}
          <div style={topRow}>
            <div className="top-row-anim" style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
              <button
                onClick={() => toggleFavorite(train)}
                className="favorite-btn"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: favorites.some(f => f.number === train.number) ? "#FFD700" : "rgba(255,255,255,0.2)",
                  padding: 0,
                  marginTop: "-2px",
                  transition: "color 0.3s ease",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {favorites.some(f => f.number === train.number)
                  ? <MdStar />
                  : <MdStarBorder />
                }
              </button>
              <div>
                <h3 style={trainTitle}>
                  {train.number} - {train.name}
                </h3>
                <div style={platformText}>
                  PF#{Math.floor(Math.random() * 8) + 1}
                </div>
              </div>
            </div>

            <div style={timeBlock} className="time-anim">
              <div>
                <div style={stationCode}>
                  {(train.from || from || "STN").slice(0, 3).toUpperCase()}
                </div>
                <div style={timeText}>{train.departureTime}</div>
              </div>

              <div style={arrow}>→</div>

              <div>
                <div style={stationCode}>
                  {(train.to || to || "STN").slice(0, 3).toUpperCase()}
                </div>
                <div style={timeText}>{train.arrivalTime}</div>
              </div>

              <div style={delayText}>
                Delay {Math.floor(Math.random() * 40)}m
              </div>
            </div>
          </div>

          {/* STATUS ROW */}
          <div style={statusRow} className="status-anim">
            <div style={liveDot} className="live-dot-pulse"></div>
            <span>
              Crossed {(train.from || from || "STATION").slice(0, 8).toUpperCase()} at {train.departureTime}
            </span>
          </div>

          {/* BUTTONS */}
          <div style={buttonRow} className="btn-anim">
            <button
              className="outline-btn"
              style={outlineButton}
              onClick={() => {
                localStorage.setItem("selectedTrain", train.number);
                navigate("/live-status");
              }}
            >
              Track Live Status
            </button>

            <button
              className="gold-btn"
              style={goldButton}
              onClick={() => {
                localStorage.setItem("selectedTrain", train.number);
                navigate("/route-map");   // 👈 route map button
              }}
            >
              View Route Map
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const platformText = {
  color: "#94a3b8",
  fontSize: "0.85rem",
  marginTop: "5px",
  fontWeight: "500",
  letterSpacing: "0.5px"
};

const timeBlock = {
  display: "flex",
  alignItems: "center",
  gap: "30px",
  background: "rgba(0,0,0,0.2)",
  padding: "15px 25px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const stationCode = {
  fontWeight: "700",
  color: "#d4af37",
  fontSize: "1.1rem",
  letterSpacing: "1px",
  marginBottom: "4px"
};

const delayText = {
  color: "#ff6b6b",
  fontSize: "0.85rem",
  fontWeight: "600",
  marginLeft: "10px",
  background: "rgba(255,107,107,0.1)",
  padding: "4px 10px",
  borderRadius: "20px"
};

const statusRow = {
  borderTop: "1px solid rgba(212,175,55,0.15)",
  borderBottom: "1px solid rgba(212,175,55,0.15)",
  padding: "16px 0",
  color: "#cbd5e1",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "20px 0",
  fontSize: "0.95rem",
  fontWeight: "400"
};

const liveDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#2ecc71",
  boxShadow: "0 0 10px #2ecc71"
};

const pageStyle = {
  padding: "120px 8% 80px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f141e 0%, #05070a 100%)",
  color: "white"
};

const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.8rem",
  color: "#d4af37",
  marginBottom: "10px",
  textShadow: "0 2px 10px rgba(212,175,55,0.2)",
  fontWeight: "700",
  letterSpacing: "0.5px"
};

const subtitleStyle = {
  color: "#94a3b8",
  marginBottom: "50px",
  fontSize: "1.1rem",
  fontWeight: "300"
};

const cardStyle = {
  background: "linear-gradient(145deg, rgba(30,38,50,0.6), rgba(15,20,28,0.8))",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "20px",
  padding: "30px",
  marginBottom: "35px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)"
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const trainTitle = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#fff",
  fontSize: "1.6rem",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textShadow: "0 1px 2px rgba(0,0,0,0.5)"
};

const arrow = {
  color: "rgba(212,175,55,0.6)",
  fontSize: "1.4rem",
  fontWeight: "300"
};

const timeText = {
  color: "#e2e8f0",
  fontWeight: "500",
  fontSize: "1.1rem"
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "20px",
  marginTop: "10px"
};

const goldButton = {
  padding: "12px 28px",
  background: "linear-gradient(135deg, #d4af37 0%, #b5952f 100%)",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#000",
  fontSize: "0.95rem",
  letterSpacing: "0.5px"
};

const outlineButton = {
  padding: "12px 28px",
  background: "rgba(212,175,55,0.05)",
  border: "1px solid rgba(212,175,55,0.5)",
  color: "#d4af37",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  letterSpacing: "0.5px"
};

export default TrackTrains;