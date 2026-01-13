import { useState } from "react";

const dummyTrains = [
  { number: "12625", name: "Kerala Express", station: "Ernakulam Junction", time: "09:30", type: "Arrival" },
  { number: "16382", name: "Kannur Express", station: "Ernakulam Junction", time: "11:10", type: "Arrival" },
  { number: "12075", name: "Jan Shatabdi", station: "Ernakulam Junction", time: "09:40", type: "Departure" },
  { number: "16629", name: "Malabar Express", station: "Shoranur Junction", time: "00:15", type: "Arrival" },
  { number: "12627", name: "Karnataka Express", station: "Nagpur Junction", time: "04:30", type: "Arrival" }
];

function StationBoard() {
  const [station, setStation] = useState("");
  const [results, setResults] = useState([]);

  const searchStation = () => {
    const filtered = dummyTrains.filter(t =>
      t.station.toLowerCase().includes(station.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="app fade-in">
      <h2>🚉 Station Board</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Station Name"
          value={station}
          onChange={(e) => setStation(e.target.value)}
        />
        <button onClick={searchStation}>Search</button>
      </div>

      {results.length > 0 && (
        <div className="train-card">
          {results.map((t, i) => (
            <div key={i} style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
              <strong>{t.name}</strong> ({t.number})  
              <br />
              ⏰ {t.time} — {t.type}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && station && (
        <p style={{ color: "#6b7280" }}>No trains found for this station</p>
      )}
    </div>
  );
}

export default StationBoard;
