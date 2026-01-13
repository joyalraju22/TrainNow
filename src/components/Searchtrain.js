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
  const [trainNumber, setTrainNumber] = useState("");
  const [trainData, setTrainData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  /* AUTO-LOAD LAST SEARCHED TRAIN + OFFLINE MODE */
  useEffect(() => {
    inputRef.current?.focus();

    if (!navigator.onLine) {
      setError("Offline mode: showing last saved data");
    }

    const lastSearch = localStorage.getItem("lastTrainSearch");
    if (lastSearch) {
      setTrainNumber(lastSearch);

      const foundTrain = dummyTrains.find(
        (train) => train.number === lastSearch
      );

      if (foundTrain) {
        setTrainData(foundTrain);
      }
    }
  }, []);

  /* SAVE RECENT SEARCH + AUDIT LOG */
  const saveRecentSearch = (trainNo) => {
    let history = [];

    try {
      history = JSON.parse(localStorage.getItem("recentTrains")) || [];
    } catch {
      localStorage.removeItem("recentTrains");
    }

    const updatedHistory = [
      {
        train: trainNo,
        time: new Date().toLocaleTimeString()
      },
      ...history.filter((item) => item.train !== trainNo)
    ];

    localStorage.setItem(
      "recentTrains",
      JSON.stringify(updatedHistory.slice(0, 5))
    );

    localStorage.setItem("lastTrainSearch", trainNo);

    localStorage.setItem(
      "searchAudit",
      JSON.stringify({
        train: trainNo,
        searchedAt: new Date().toISOString()
      })
    );
  };

  /* SEARCH TRAIN */
  const searchTrain = () => {
    if (loading) return;

    const input = trainNumber.trim();
    if (!input) {
      setError("Please enter a train number or name");
      setTrainData(null);
      return;
    }

    setLoading(true);
    setError("");
    setTrainData(null);
    setSuggestions([]);

    setTimeout(() => {
      const foundTrain = dummyTrains.find(
        (train) =>
          train.number === input ||
          train.name.toLowerCase().includes(input.toLowerCase())
      );

      if (!foundTrain) {
        setError("Train not found");
      } else {
        setTrainData(foundTrain);
        saveRecentSearch(foundTrain.number);
        localStorage.setItem("selectedTrain", foundTrain.number);
      }

      setLoading(false);
    }, 800);
  };

  /* INPUT CHANGE + AUTO-SUGGEST */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTrainNumber(value);
    setError("");

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = dummyTrains.filter(
      (train) =>
        train.name.toLowerCase().includes(value.toLowerCase()) ||
        train.number.includes(value)
    );

    setSuggestions(filtered.slice(0, 5));
  };

  /* ENTER KEY SEARCH */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTrain();
    }
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
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/live-status" className="nav-link">Live Status</Link>
          <Link to="/route-map" className="nav-link">Route Map</Link>
          <Link to="/journey-planner" className="nav-link">
            Journey Planner
          </Link>
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

      {/* SEARCH CONTENT */}
      <div className="app fade-in">
        <h2>Search Train</h2>

        <div className="search-box">
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter Train Number"
              value={trainNumber}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            {suggestions.length > 0 && (
              <div className="suggestion-box">
                {suggestions.map((train, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setTrainNumber(train.number);
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        {trainData && (
          <div className="train-card result-animate">
            <h3>🚆 {trainData.name}</h3>
            <p><strong>Train No:</strong> {trainData.number}</p>
            <p><strong>Status:</strong> {trainData.status}</p>
            <p>📍 <strong>Current Station:</strong> {trainData.currentStation}</p>
            <p>⏱ <strong>Delay:</strong> {trainData.delay}</p>

            <button
              className="btn-primary"
              style={{ marginTop: "18px" }}
              onClick={() => navigate("/route-map")}
            >
              View Route Map →
            </button>
          </div>
        )}

        <RecentSearches />
      </div>
    </>
  );
}

export default SearchTrain;
