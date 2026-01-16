import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Train name mapping (for better UX) */
const trainDirectory = {
  "12627": "Karnataka Express",
  "12625": "Kerala Express",
  "16382": "Kannur Express",
  "12075": "Jan Shatabdi Express",
  "16629": "Malabar Express"
};

function RecentSearches() {
  const [recentTrains, setRecentTrains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("recentTrains")) || [];
      setRecentTrains(history.slice(0, 5));
    } catch {
      localStorage.removeItem("recentTrains");
      setRecentTrains([]);
    }
  }, []);

  const handleView = (trainNumber) => {
    localStorage.setItem("lastTrainSearch", trainNumber);
    localStorage.setItem("autoSearch", "true");
    navigate("/search");
  };

  const clearHistory = () => {
    localStorage.removeItem("recentTrains");
    setRecentTrains([]);
  };

  if (recentTrains.length === 0) {
    return (
      <div
        className="train-card"
        style={{ marginTop: "30px", color: "#6b7280" }}
      >
        <h3>🕘 Recent Searches</h3>
        <p style={{ fontSize: "0.9rem" }}>
          No recent train searches available.
          <br />
          Your last searched trains will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="train-card fade-in" style={{ marginTop: "30px" }}>
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}
      >
        <div>
          <h3 style={{ marginBottom: "2px" }}>🕘 Recent Train Searches</h3>
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Last 5 enquiries
          </p>
        </div>

        <button
          onClick={clearHistory}
          style={{
            background: "transparent",
            border: "none",
            color: "#dc2626",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          Clear
        </button>
      </div>

      {/* LIST */}
      {recentTrains.map((train, index) => (
        <div
          key={index}
          onClick={() => handleView(train.train || train.number)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            marginBottom: "8px",
            borderRadius: "6px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            cursor: "pointer"
          }}
        >
          <div>
            <strong>
              {trainDirectory[train.train || train.number] || "Train"} (
              {train.train || train.number})
            </strong>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Searched at {train.time}
            </div>
          </div>

          <span
            style={{
              fontSize: "0.85rem",
              color: "#0f766e",
              fontWeight: 600
            }}
          >
            View →
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentSearches;
