import { useEffect, useState } from "react";

/* ROUTE DATA FOR ALL TRAINS */
const routeData = {
  "12627": {
    name: "Karnataka Express",
    currentStation: "Nagpur Junction",
    route: [
      { station: "Bengaluru City", arr: "07:00", dep: "07:10" },
      { station: "Bhopal Junction", arr: "22:10", dep: "22:20" },
      { station: "Nagpur Junction", arr: "04:30", dep: "04:40" },
      { station: "Itarsi Junction", arr: "08:20", dep: "08:25" },
      { station: "Jhansi Junction", arr: "13:40", dep: "13:45" },
      { station: "New Delhi", arr: "20:30", dep: "--" }
    ]
  },

  "12625": {
    name: "Kerala Express",
    currentStation: "Palakkad Junction",
    route: [
      { station: "Thiruvananthapuram Central", arr: "06:00", dep: "06:10" },
      { station: "Kollam Junction", arr: "07:05", dep: "07:07" },
      { station: "Alappuzha", arr: "08:20", dep: "08:22" },
      { station: "Ernakulam Junction", arr: "09:30", dep: "09:35" },
      { station: "Palakkad Junction", arr: "11:50", dep: "11:55" },
      { station: "Coimbatore", arr: "12:40", dep: "12:45" },
      { station: "Salem", arr: "15:30", dep: "15:35" },
      { station: "Chennai Central", arr: "20:45", dep: "--" }
    ]
  },

  "16382": {
    name: "Kannur Express",
    currentStation: "Kozhikode",
    route: [
      { station: "Kannur", arr: "05:30", dep: "05:40" },
      { station: "Thalassery", arr: "06:10", dep: "06:12" },
      { station: "Kozhikode", arr: "07:05", dep: "07:10" },
      { station: "Vadakara", arr: "07:35", dep: "07:37" },
      { station: "Shoranur Junction", arr: "09:10", dep: "09:15" },
      { station: "Thrissur", arr: "09:55", dep: "10:00" },
      { station: "Ernakulam Junction", arr: "11:10", dep: "11:15" },
      { station: "Thiruvananthapuram Central", arr: "16:30", dep: "--" }
    ]
  },

  "12075": {
    name: "Jan Shatabdi Express",
    currentStation: "Ernakulam Junction",
    route: [
      { station: "Thiruvananthapuram Central", arr: "06:15", dep: "06:25" },
      { station: "Kollam Junction", arr: "07:10", dep: "07:12" },
      { station: "Alappuzha", arr: "08:25", dep: "08:27" },
      { station: "Ernakulam Junction", arr: "09:35", dep: "09:40" },
      { station: "Thrissur", arr: "10:35", dep: "10:40" },
      { station: "Shoranur Junction", arr: "11:30", dep: "11:35" },
      { station: "Kozhikode", arr: "13:15", dep: "--" }
    ]
  },

  "16629": {
    name: "Malabar Express",
    currentStation: "Shoranur Junction",
    route: [
      { station: "Thiruvananthapuram Central", arr: "18:20", dep: "18:30" },
      { station: "Kollam Junction", arr: "19:15", dep: "19:17" },
      { station: "Kayamkulam", arr: "20:10", dep: "20:12" },
      { station: "Alappuzha", arr: "21:05", dep: "21:07" },
      { station: "Ernakulam Junction", arr: "22:15", dep: "22:20" },
      { station: "Thrissur", arr: "23:20", dep: "23:25" },
      { station: "Shoranur Junction", arr: "00:15", dep: "00:20" },
      { station: "Kozhikode", arr: "02:00", dep: "02:05" },
      { station: "Kannur", arr: "04:30", dep: "04:35" },
      { station: "Mangaluru", arr: "06:45", dep: "--" }
    ]
  }
};

function RouteMap() {
  const [train, setTrain] = useState(null);

  /* Auto-load selected train with validation + persistence */
  useEffect(() => {
    const selected = localStorage.getItem("selectedTrain");

    // ✅ Route integrity validation (RS14)
    if (!selected || !routeData[selected]?.route?.length) {
      setTrain(null);
      return;
    }

    const selectedRoute = routeData[selected];
    setTrain(selectedRoute);

    // ✅ Persist last viewed route (RS11)
    localStorage.setItem(
      "lastViewedRoute",
      JSON.stringify(selectedRoute)
    );
  }, []);

  return (
    <div className="app fade-in">
      <h2>Route Map</h2>

      {!train && (
        <div className="train-card">
          <p style={{ color: "#6b7280" }}>
            🚆 No train selected.
            <br />
            Please search a train to view its route.
          </p>
        </div>
      )}

      {train && (
        <div className="train-card timeline-card route-card">
          <h3>🚆 {train.name}</h3>

          <div className="timeline">
            {train.route.map((stop, index) => {
              const currentIndex = train.route.findIndex(
                (s) => s.station === train.currentStation
              );

              const isCurrent = stop.station === train.currentStation;
              const isCompleted = index < currentIndex;
              const isStart = index === 0;
              const isEnd = index === train.route.length - 1;

              return (
                <div
                  key={index}
                  className={`timeline-item 
                    ${isCurrent ? "active" : ""} 
                    ${isCompleted ? "completed" : ""}
                    ${isStart ? "start" : ""} 
                    ${isEnd ? "end" : ""}`}
                >
                  <span className="dot">
                    {isStart && "🚩"}
                    {isCurrent && "🚆"}
                    {isEnd && "🏁"}
                  </span>

                  <div className="station-details">
                    <strong>{stop.station}</strong>

                    <div className="time-row">
                      <span>Arr: {stop.arr}</span>
                      <span>Dep: {stop.dep}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteMap;
