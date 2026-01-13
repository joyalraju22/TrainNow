import { useEffect, useState } from "react";

/* SIMULATED LIVE TRAIN DATA (NTES STYLE) */
const liveTrainData = {
  "12627": {
    number: "12627",
    name: "Karnataka Express",
    status: "Running On Time",
    currentStation: "Nagpur Junction",
    delay: "0 min"
  },
  "12625": {
    number: "12625",
    name: "Kerala Express",
    status: "Delayed",
    currentStation: "Palakkad Junction",
    delay: "15 min"
  },
  "16382": {
    number: "16382",
    name: "Kannur Express",
    status: "Running On Time",
    currentStation: "Kozhikode",
    delay: "0 min"
  },
  "12075": {
    number: "12075",
    name: "Jan Shatabdi Express",
    status: "Arrived",
    currentStation: "Ernakulam Junction",
    delay: "-"
  },
  "16629": {
    number: "16629",
    name: "Malabar Express",
    status: "Running Late",
    currentStation: "Shoranur Junction",
    delay: "25 min"
  }
};

function LiveStatus() {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedTrain = localStorage.getItem("selectedTrain");

    /* OFFLINE FALLBACK (RS11) */
    if (!navigator.onLine) {
      const lastStatus = localStorage.getItem("lastLiveStatus");
      if (lastStatus) {
        setTrain(JSON.parse(lastStatus));
      }
      setLoading(false);
      return;
    }

    /* INITIAL FETCH (SIMULATED) */
    const fetchLiveStatus = () => {
      if (selectedTrain && liveTrainData[selectedTrain]) {
        const liveStatus = {
          ...liveTrainData[selectedTrain],
          lastUpdated: new Date().toLocaleTimeString()
        };

        setTrain(liveStatus);

        // Save last known live status
        localStorage.setItem(
          "lastLiveStatus",
          JSON.stringify(liveStatus)
        );
      }
      setLoading(false);
    };

    fetchLiveStatus();

    /* AUTO-REFRESH (NTES STYLE) */
    const interval = setInterval(() => {
      if (selectedTrain && liveTrainData[selectedTrain]) {
        const refreshedStatus = {
          ...liveTrainData[selectedTrain],
          lastUpdated: "Just now"
        };

        setTrain(refreshedStatus);

        localStorage.setItem(
          "lastLiveStatus",
          JSON.stringify(refreshedStatus)
        );
      }
    }, 15000); // refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app fade-in">
      <h2>Live Train Status</h2>

      {loading && <p>Fetching live status...</p>}

      {!loading && !train && (
        <div className="train-card">
          <p style={{ color: "#6b7280" }}>
            🚆 No train selected.
            <br />
            Please search a train to view live status.
          </p>
        </div>
      )}

      {!loading && train && (
  <div className="train-card live-status-card">
    
    {/* HEADER */}
    <div className="live-header">
      <div>
        <h3>🚆 {train.name}</h3>
        <p className="train-number">
          Train No: <strong>{train.number}</strong>
        </p>
      </div>

      <div className={`status-badge ${train.status.replace(/\s/g, "").toLowerCase()}`}>
        {train.status}
      </div>
    </div>

    {/* BODY */}
    <div className="live-body">
      <div className="live-row">
        <span>📍 Current Station</span>
        <strong>{train.currentStation}</strong>
      </div>

      <div className="live-row">
        <span>⏱ Delay</span>
        <strong>{train.delay}</strong>
      </div>
    </div>

    {/* FOOTER */}
    <div className="live-footer">
      🔄 Last Updated: {train.lastUpdated}
    </div>

  </div>
)}

    </div>
  );
}

export default LiveStatus;
