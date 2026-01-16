import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import RecentSearches from "./RecentSearches";

/* Dummy train database */
const dummyTrains = [
  {
    number: "12627",
    name: "Karnataka Express",
    status: "Running On Time",
    currentStation: "Nagpur Junction",
    delay: "0 min"
  },
  {
    number: "12625",
    name: "Kerala Express",
    status: "Delayed",
    currentStation: "Palakkad Junction",
    delay: "15 min"
  },
  {
    number: "16382",
    name: "Kannur Express",
    status: "Running On Time",
    currentStation: "Kozhikode",
    delay: "0 min"
  },
  {
    number: "12075",
    name: "Jan Shatabdi Express",
    status: "Arrived",
    currentStation: "Ernakulam Junction",
    delay: "-"
  },
  {
    number: "16629",
    name: "Malabar Express",
    status: "Running Late",
    currentStation: "Shoranur Junction",
    delay: "25 min"
  }
];

function SearchTrain() {
  const [trainInput, setTrainInput] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  /* AUTO-LOAD LAST SEARCH */
  useEffect(() => {
    inputRef.current?.focus();

    const lastSearch = localStorage.getItem("lastTrainSearch");
    if (lastSearch) {
      setTrainInput(lastSearch);
      const found = dummyTrains.find(t => t.number === lastSearch);
      if (found) setTrainData(found);
    }
  }, []);

  /* SAVE SEARCH (GOVERNMENT AUDIT STYLE) */
  const saveSearch = (trainNo) => {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem("recentTrains")) || [];
    } catch {
      localStorage.removeItem("recentTrains");
    }

    const updated = [
      { train: trainNo, time: new Date().toLocaleTimeString() },
      ...history.filter(h => h.train !== trainNo)
    ];

    localStorage.setItem("recentTrains", JSON.stringify(updated.slice(0, 5)));
    localStorage.setItem("lastTrainSearch", trainNo);
    localStorage.setItem("selectedTrain", trainNo);
  };

  /* SEARCH TRAIN */
  const searchTrain = () => {
    if (loading) return;

    const value = trainInput.trim();
    if (!value) {
      setError("Please enter a train number or train name");
      setTrainData(null);
      return;
    }

    setLoading(true);
    setError("");
    setTrainData(null);
    setSuggestions([]);

    setTimeout(() => {
      const found = dummyTrains.find(
        t =>
          t.number === value ||
          t.name.toLowerCase().includes(value.toLowerCase())
      );

      if (!found) {
        setError("No train found for the given input");
      } else {
        setTrainData(found);
        saveSearch(found.number);
      }

      setLoading(false);
    }, 700);
  };

  /* INPUT + SUGGESTIONS */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTrainInput(value);
    setError("");

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = dummyTrains.filter(
      t =>
        t.name.toLowerCase().includes(value.toLowerCase()) ||
        t.number.includes(value)
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <>
      {/* TOP BAR */}
      <header className="top-bar">
        <div className="top-left">
          <img
            src={`${process.env.PUBLIC_URL}/logo (3).png`}
            alt="TrainNow"
            className="logo-img"
          />
          <span className="brand">TrainNow</span>
        </div>

        <nav className="top-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link active">Search</Link>
          <Link to="/live-status" className="nav-link">Live Status</Link>
          <Link to="/route-map" className="nav-link">Route Map</Link>
          <Link to="/journey-planner" className="nav-link">Journey Planner</Link>
          <Link to="/help" className="nav-link">Help</Link>
        </nav>

        <div className="top-right">
          <button
            className="nav-btn outline"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="app fade-in">
        <h2>Search Train</h2>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          Enter Train Number or Train Name to view current running status
        </p>

        {/* SEARCH BAR */}
        <div className="search-box">
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Eg: 12627 or Karnataka Express"
              value={trainInput}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && searchTrain()}
            />

            {suggestions.length > 0 && (
              <div className="suggestion-box">
                {suggestions.map((train, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setTrainInput(train.number);
                      setSuggestions([]);
                    }}
                  >
                    <div className="suggestion-content">
                      <div className="station-code">TRN</div>
                      <div className="station-text">
                        <div className="station-name">
                          {train.name} ({train.number})
                        </div>
                        <div className="station-sub">Express Train</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="gov-btn"
            onClick={searchTrain}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Trains"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* RESULT */}
        {trainData && (
          <div className="train-card result-animate">
            <h3>🚆 {trainData.name}</h3>

            <p><strong>Train Number:</strong> {trainData.number}</p>
            <p><strong>Status:</strong> {trainData.status}</p>
            <p>📍 <strong>Current Station:</strong> {trainData.currentStation}</p>
            <p>⏱ <strong>Delay:</strong> {trainData.delay}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                className="gov-btn"
                onClick={() => navigate("/live-status")}
              >
                View Live Status
              </button>

              <button
                className="gov-btn"
                onClick={() => navigate("/route-map")}
              >
                View Route Map
              </button>
            </div>
          </div>
        )}

        <RecentSearches />
      </div>
    </>
  );
}

export default SearchTrain;
