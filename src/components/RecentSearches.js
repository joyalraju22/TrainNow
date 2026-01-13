import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecentSearches() {
  const [recentTrains, setRecentTrains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("recentTrains")) || [];
    setRecentTrains(history.slice(0, 5));
  }, []);

  const handleView = (trainNumber) => {
    // store selected train
    localStorage.setItem("lastTrainSearch", trainNumber);
    localStorage.setItem("selectedTrain", trainNumber);

    // tell SearchTrain to auto-search
    localStorage.setItem("autoSearch", "true");

    navigate("/search");
  };

  if (recentTrains.length === 0) return null;

  return (
    <div className="train-card fade-in" style={{ marginTop: "30px" }}>
      <h3>🕘 Recent Searches</h3>

      {recentTrains.map((train) => (
        <div
          key={train.number}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            background: "#f4f6f8"
          }}
        >
          <div>
            🚆 <strong>{train.number}</strong>
            <br />
            <small>Last searched: {train.time}</small>
          </div>

          <span
            style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}
            onClick={() => handleView(train.number)}
          >
            View →
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentSearches;
