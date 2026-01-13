import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ROUTE DATA (same logic as RouteMap) */
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

/* ✅ UNIQUE STATION LIST (FOR AUTO-SUGGEST) */
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

  /* AUTO-SUGGEST HANDLERS */
  const handleFromChange = (value) => {
    setFrom(value);
    setError("");

    if (value.length < 2) {
      setFromSuggestions([]);
      return;
    }

    const filtered = allStations.filter(station =>
      station.toLowerCase().includes(value.toLowerCase())
    );

    setFromSuggestions(filtered.slice(0, 5));
  };

  const handleToChange = (value) => {
    setTo(value);
    setError("");

    if (value.length < 2) {
      setToSuggestions([]);
      return;
    }

    const filtered = allStations.filter(station =>
      station.toLowerCase().includes(value.toLowerCase())
    );

    setToSuggestions(filtered.slice(0, 5));
  };

  /* PLAN JOURNEY */
  const planJourney = () => {
    setError("");
    setResults([]);

    if (!from || !to) {
      setError("Please enter both From and To stations");
      return;
    }

    const matches = [];

    Object.entries(routeData).forEach(([number, train]) => {
      const fromIndex = train.route.findIndex(
        s => s.toLowerCase() === from.toLowerCase()
      );
      const toIndex = train.route.findIndex(
        s => s.toLowerCase() === to.toLowerCase()
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
    } else {
      setResults(matches);
    }
  };

  return (
    <>
      {/* TOP NAV BAR */}
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

      {/* JOURNEY PLANNER CONTENT */}
      <div className="app fade-in">
  <h2 className="section-title">Journey Planner</h2>

  <div className="journey-panel">
  <table className="journey-form">
    <tbody>
      <tr>
        <td>From Station</td>
        <td>
          <input
            type="text"
            value={from}
            onChange={(e) => handleFromChange(e.target.value)}
          />
          {fromSuggestions.length > 0 && (
  <div className="suggestion-box">
    {fromSuggestions.map((station, index) => (
      <div
        key={index}
        className="suggestion-item"
        onClick={() => {
          setFrom(station);
          setFromSuggestions([]);
        }}
      >
        <div className="suggestion-content">
  <div className="station-code">STN</div>
  <div className="station-text">
    <div className="station-name">{station}</div>
    <div className="station-sub">Railway Station</div>
  </div>
</div>
      </div>
    ))}
  </div>
)}

        </td>
      </tr>

      <tr>
        <td>To Station</td>
        <td>
          <input
            type="text"
            value={to}
            onChange={(e) => handleToChange(e.target.value)}
          />
          {toSuggestions.length > 0 && (
            <div className="suggestion-box">
              {toSuggestions.map((station, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setTo(station);
                    setToSuggestions([]);
                  }}
                >
                  🚉 {station}
                </div>
              ))}
            </div>
          )}
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
  <div key={train.number} className="gov-result">
    <table>
      <tbody>
        <tr>
          <td>Train Name</td>
          <td>{train.name}</td>
        </tr>
        <tr>
          <td>Train Number</td>
          <td>{train.number}</td>
        </tr>
        <tr>
          <td>From Station</td>
          <td>{train.from}</td>
        </tr>
        <tr>
          <td>To Station</td>
          <td>{train.to}</td>
        </tr>
      </tbody>
    </table>
  </div>
))}

</div>

    </>
  );
}

export default JourneyPlanner;
