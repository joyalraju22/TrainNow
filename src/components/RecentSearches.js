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
      <div className="recent-searches-empty">
        <h3>🕘 Recent Searches</h3>
        <p>
          No recent train searches available.
          <br />
          Your last searched trains will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="recent-searches-card fade-in">
      
      {/* HEADER */}
      <div className="recent-searches-header">
        <div>
          <h3>🕘 Recent Train Searches</h3>
          <p className="recent-searches-subtitle">Last 5 enquiries</p>
        </div>

        <button onClick={clearHistory} className="recent-searches-clear-btn">
          Clear
        </button>
      </div>

      {/* LIST */}
      <div className="recent-searches-list">
        {recentTrains.map((train, index) => (
          <div
            key={index}
            onClick={() => handleView(train.train || train.number)}
            className="recent-search-item"
          >
            <div className="recent-search-content">
              <strong className="recent-search-title">
                {trainDirectory[train.train || train.number] || "Train"} (
                {train.train || train.number})
              </strong>
              <div className="recent-search-time">
                Searched at {train.time}
              </div>
            </div>

            <span className="recent-search-action">
              View →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
