import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ROUTE DATA */
const routeData = {
  "12627": {
    name: "Karnataka Express",
    route: [
      "Bengaluru City",
      "Bhopal Junction",
      "Nagpur Junction",
      "Itarsi Junction",
      "Jhansi Junction",
      "New Delhi"
    ]
  },
  "12625": {
    name: "Kerala Express",
    route: [
      "Thiruvananthapuram Central",
      "Kollam Junction",
      "Alappuzha",
      "Ernakulam Junction",
      "Palakkad Junction",
      "Coimbatore",
      "Salem",
      "Chennai Central"
    ]
  },
  "16382": {
    name: "Kannur Express",
    route: [
      "Kannur",
      "Thalassery",
      "Kozhikode",
      "Vadakara",
      "Shoranur Junction",
      "Thrissur",
      "Ernakulam Junction",
      "Thiruvananthapuram Central"
    ]
  },
  "12075": {
    name: "Jan Shatabdi Express",
    route: [
      "Thiruvananthapuram Central",
      "Kollam Junction",
      "Alappuzha",
      "Ernakulam Junction",
      "Thrissur",
      "Shoranur Junction",
      "Kozhikode"
    ]
  },
  "16629": {
    name: "Malabar Express",
    route: [
      "Thiruvananthapuram Central",
      "Kollam Junction",
      "Kayamkulam",
      "Alappuzha",
      "Ernakulam Junction",
      "Thrissur",
      "Shoranur Junction",
      "Kozhikode",
      "Kannur",
      "Mangaluru"
    ]
  }
};

/* UNIQUE STATIONS */
const allStations = Array.from(
  new Set(Object.values(routeData).flatMap(train => train.route))
);

function JourneyPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  /* OFFLINE FALLBACK */
  useEffect(() => {
    if (!navigator.onLine) {
      const cached = JSON.parse(localStorage.getItem("lastJourney"));
      if (cached) {
        setResults(cached);
      }
    }
  }, []);

  /* AUTO-SUGGEST */
  const handleFromChange = (value) => {
    setFrom(value);
    setError("");

    if (value.trim().length < 2) {
      setFromSuggestions([]);
      return;
    }

    setFromSuggestions(
      allStations
        .filter(s => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
    );
  };

  const handleToChange = (value) => {
    setTo(value);
    setError("");

    if (value.trim().length < 2) {
      setToSuggestions([]);
      return;
    }

    setToSuggestions(
      allStations
        .filter(s => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
    );
  };

  /* PLAN JOURNEY */
  const planJourney = () => {
    setError("");
    setResults([]);

    const fromClean = from.trim();
    const toClean = to.trim();

    if (!fromClean || !toClean) {
      setError("Please enter both From and To stations");
      return;
    }

    if (fromClean.toLowerCase() === toClean.toLowerCase()) {
      setError("From and To stations cannot be the same");
      return;
    }

    const matches = [];

    Object.entries(routeData).forEach(([number, train]) => {
      if (!Array.isArray(train.route)) return;

      const fromIndex = train.route.findIndex(
        s => s.toLowerCase() === fromClean.toLowerCase()
      );
      const toIndex = train.route.findIndex(
        s => s.toLowerCase() === toClean.toLowerCase()
      );

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        matches.push({
          number,
          name: train.name,
          from: train.route[fromIndex],
          to: train.route[toIndex]
        });
      }
    });

    if (matches.length === 0) {
      setError("No direct trains found for this journey");
      return;
    }

    setResults(matches);

    /* SAVE FOR OFFLINE */
    localStorage.setItem("lastJourney", JSON.stringify(matches));

    /* AUDIT LOG */
    localStorage.setItem(
      "journeyAudit",
      JSON.stringify({
        from: fromClean,
        to: toClean,
        searchedAt: new Date().toISOString()
      })
    );
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
          <Link
            to="/journey-planner"
            className={`nav-link ${location.pathname === "/journey-planner" ? "active" : ""}`}
          >
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

      {/* CONTENT */}
      <div className="app fade-in">
        <h2 className="section-title">Journey Planner</h2>

        <div className="journey-panel">
          <table className="journey-form">
            <tbody>
              <tr>
                <td>From Station</td>
                <td>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => handleFromChange(e.target.value)}
                    />
                    {fromSuggestions.length > 0 && (
                      <div className="suggestion-box">
                        {fromSuggestions.map((s, i) => (
                          <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => {
                              setFrom(s);
                              setFromSuggestions([]);
                            }}
                          >
                            <div className="suggestion-content">
                              <div className="station-code">STN</div>
                              <div className="station-text">
                                <div className="station-name">{s}</div>
                                <div className="station-sub">Railway Station</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              <tr>
                <td>To Station</td>
                <td>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => handleToChange(e.target.value)}
                    />
                    {toSuggestions.length > 0 && (
                      <div className="suggestion-box">
                        {toSuggestions.map((s, i) => (
                          <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => {
                              setTo(s);
                              setToSuggestions([]);
                            }}
                          >
                            <div className="suggestion-content">
                              <div className="station-code">STN</div>
                              <div className="station-text">
                                <div className="station-name">{s}</div>
                                <div className="station-sub">Railway Station</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <button className="gov-btn" onClick={planJourney}>
                    Search Trains
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {error && <p className="error-text">{error}</p>}

        {results.map((train) => (
  <div key={train.number} className="gov-result fade-in">

    {/* HEADER */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #cbd5e1",
      paddingBottom: "8px",
      marginBottom: "10px"
    }}>
      <strong style={{ fontSize: "1rem", color: "#0f172a" }}>
        🚆 {train.name}
      </strong>
      <span style={{ fontSize: "0.85rem", color: "#475569" }}>
        Train No: {train.number}
      </span>
    </div>

    {/* JOURNEY STRIP */}
    <div style={{
      background: "#e6fffa",
      border: "1px solid #99f6e4",
      borderRadius: "4px",
      padding: "8px 12px",
      marginBottom: "12px",
      fontWeight: 600,
      color: "#065f46"
    }}>
      {train.from} → {train.to}
    </div>

    {/* DETAILS GRID */}
    <div className="journey-info">
      <div>
        <span>From Station</span>
        <strong>{train.from}</strong>
      </div>

      <div>
        <span>To Station</span>
        <strong>{train.to}</strong>
      </div>

      <div>
        <span>Journey Type</span>
        <strong>Direct</strong>
      </div>

      <div>
        <span>Data Source</span>
        <strong>Demo / Simulation</strong>
      </div>
    </div>

  </div>
))}

      </div>
    </>
  );
}

export default JourneyPlanner;
