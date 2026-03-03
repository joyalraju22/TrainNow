import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { useToast } from "../contexts/ToastContext";
import trainService from "../services/trainService";
import {
  MdLocationOn,
  MdUpdate,
  MdSpeed,
  MdStraighten,
  MdTrendingUp,
  MdOutlineGpsFixed,
  MdMap
} from "react-icons/md";


function LiveStatus() {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [route, setRoute] = useState([]);

  const navigate = useNavigate();
  useToast();


  useEffect(() => {
    const selectedTrain = localStorage.getItem("selectedTrain");

    if (!selectedTrain) {
      setError("No train selected. Please search for a train first.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const liveStatus = await trainService.getTrainLiveStatus(selectedTrain);
        setTrain(liveStatus);
        setLastUpdate(new Date().toLocaleTimeString());

        const routeData = await trainService.getTrainRoute(selectedTrain);
        setRoute(routeData.route);

        setError("");
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch live status. Please try again.");
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Increased to 60 seconds to save API budget

    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%)",
        padding: "120px 8% 80px",
        color: "white",
      }}
    >
      {loading && (
        <div style={{ textAlign: "center", marginTop: "100px", animation: "fadeInUp 0.8s ease-out" }}>
          <h3 className="glow-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem" }}>
            Synchronizing with Satellite Feed...
          </h3>
          <div style={{ width: "200px", height: "1px", background: "var(--gold-gradient)", margin: "20px auto", opacity: 0.5 }}></div>
        </div>
      )}

      {error && (
        <div
          className="premium-card"
          style={{
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            borderColor: "rgba(239, 68, 68, 0.5)",
            background: "rgba(239, 68, 68, 0.05)"
          }}
        >
          <strong style={{ color: "#ef4444", display: "block", marginBottom: "10px" }}>Connectivity Issue</strong>
          <span style={{ opacity: 0.8 }}>{error}</span>
        </div>
      )}

      {!loading && train && !error && (
        <div className="animate-fade-in-up">
          {/* HERO PANEL */}
          <div
            className="premium-card"
            style={{
              padding: "45px",
              marginBottom: "40px",
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background Decorative Element */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "rgba(212, 175, 55, 0.03)", borderRadius: "50%", filter: "blur(40px)" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#d4af37", letterSpacing: "3px", textTransform: "uppercase", fontWeight: "600", marginBottom: "10px", display: "block" }}>
                  Active Transit Report
                </span>
                <h2
                  className="glow-text"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "3.5rem",
                    color: "#d4af37",
                    marginBottom: "5px",
                    lineHeight: 1
                  }}
                >
                  {train.trainName}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <p style={{ color: "#c9c9c9", fontSize: "1.2rem", fontWeight: "300" }}>
                    Grand Suite Express #{train.trainNumber}
                  </p>
                  <div style={{ height: "4px", width: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "50%" }}></div>
                  <span style={{ color: "#888", fontSize: "0.9rem" }}>v2.4.0 Live</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239, 68, 68, 0.08)", padding: "10px 20px", borderRadius: "100px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                  <div className="bioluminescent-dot" style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></div>
                  <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "800", letterSpacing: "2px" }}>ENCRYPTION SECURE</span>
                </div>
                {train.source && (
                  <span style={{ fontSize: "0.7rem", color: "#d4af37", opacity: 0.6, letterSpacing: "1px" }}>
                    AUTHENTICATED VIA {train.source.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: "35px",
                display: "inline-flex",
                alignItems: "center",
                gap: "15px",
                padding: "12px 30px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "100px",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#888" }}>Current Ops Status:</span>
              <span style={{ color: "#d4af37", fontWeight: "700", fontSize: "1rem" }}>{train.status}</span>
            </div>
          </div>

          {/* INFO GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              marginBottom: "40px",
            }}
          >
            <div className="stagger-1 animate-fade-in-up">
              <InfoCard
                label="GEO-LOCATION"
                value={train.currentStation}
                icon={<MdLocationOn />}
                highlight
              />
            </div>

            <div className="stagger-2 animate-fade-in-up">
              <InfoCard
                label="TERMINAL DESTINATION"
                value={train.nextStation}
                icon={<MdLocationOn />}
              />
            </div>

            <div className="stagger-3 animate-fade-in-up">
              <InfoCard
                label="VARIANCE (DELAY)"
                value={train.delay || "ON TIME"}
                icon={<MdUpdate />}
                highlight={train.delay && train.delay !== "No Delay" && train.delay !== "On Time" && !train.delay.includes("0")}
              />
            </div>

            <div className="stagger-4 animate-fade-in-up">
              <InfoCard
                label="VELOCITY"
                value={`${train.speedKmh || 0} KM/H`}
                icon={<MdSpeed />}
              />
            </div>

            <div className="stagger-5 animate-fade-in-up">
              <InfoCard
                label="TELEMETRY UPDATED"
                value={lastUpdate || "SYNCING..."}
                icon={<MdUpdate />}
              />
            </div>

            <div className="stagger-1 animate-fade-in-up">
              <InfoCard
                label="VOYAGE COMPLETION"
                value={`${train.progressPercentage || 0}%`}
                icon={<MdTrendingUp />}
              />
            </div>
          </div>

          {/* STATION TIMELINE */}
          {train.stations && train.stations.length > 0 && (
            <div
              className="premium-card stagger-2 animate-fade-in-up"
              style={{
                borderRadius: "24px",
                padding: "40px",
                marginBottom: "40px",
                maxHeight: "600px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#d4af37", margin: 0 }}>
                  Journey Telemetry Timeline
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "1px" }}>{train.stations.length} DATA NODES</span>
              </div>

              <div style={{ position: "relative", paddingLeft: "40px" }}>
                <div style={{
                  position: "absolute",
                  left: "14px",
                  top: "10px",
                  bottom: "10px",
                  width: "2px",
                  background: "linear-gradient(to bottom, rgba(212, 175, 55, 0.8), rgba(212, 175, 55, 0.05))"
                }}></div>

                {train.stations.map((s, idx) => {
                  const isPassed = s.Status && s.Status.toLowerCase().includes("departed");
                  const isCurrent = (train.currentStation && s.StationName && train.currentStation.includes(s.StationName)) || s.Status?.includes("Arrived");

                  return (
                    <div key={idx} style={{
                      position: "relative",
                      marginBottom: "35px",
                      opacity: isPassed ? 0.4 : 1,
                      transition: "opacity 0.3s ease"
                    }}>
                      <div
                        className={isCurrent ? "bioluminescent-dot" : ""}
                        style={{
                          position: "absolute",
                          left: "-34px",
                          top: "6px",
                          width: isCurrent ? "18px" : "12px",
                          height: isCurrent ? "18px" : "12px",
                          borderRadius: "50%",
                          background: isCurrent ? "#d4af37" : (isPassed ? "rgba(212, 175, 55, 0.4)" : "#222"),
                          boxShadow: isCurrent ? "0 0 20px #d4af37" : "none",
                          border: "3px solid #000",
                          zIndex: 2,
                          transform: `translateX(${isCurrent ? -3 : 0}px)`
                        }}
                      />
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px 25px",
                        background: isCurrent ? "rgba(212, 175, 55, 0.05)" : "transparent",
                        border: isCurrent ? "1px solid rgba(212, 175, 55, 0.1)" : "none",
                        borderRadius: "15px"
                      }}>
                        <div>
                          <div style={{
                            fontSize: "1.1rem",
                            fontWeight: isCurrent ? "700" : "400",
                            color: isCurrent ? "#d4af37" : "white",
                            letterSpacing: "0.5px"
                          }}>
                            {s.StationName} <span style={{ opacity: 0.5, fontSize: "0.8rem", marginLeft: "8px" }}>[{s.StationCode}]</span>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px", fontFamily: "monospace" }}>
                            SCHEDULED ARRIVAL: {s.ArrivalTime || "--"} | DEPARTURE: {s.DepartureTime || "--"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {s.DelayInArrival !== undefined && (
                            <div style={{
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              color: s.DelayInArrival === "0" || !s.DelayInArrival ? "#4ade80" : "#fb7185",
                              textShadow: s.DelayInArrival === "0" || !s.DelayInArrival ? "0 0 10px rgba(74, 222, 128, 0.2)" : "0 0 10px rgba(251, 113, 133, 0.2)"
                            }}>
                              {s.DelayInArrival === "0" || !s.DelayInArrival ? "NOMINAL" : `+${s.DelayInArrival}M VARIANCE`}
                            </div>
                          )}
                          {s.Status && (
                            <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
                              {s.Status}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", justifyContent: "center" }}>
            <GoldButton onClick={() => navigate("/route-map")}>
              EXPLORE ROUTE MAP
            </GoldButton>

            <OutlineButton onClick={() => navigate("/")}>
              NEW INVESTIGATION
            </OutlineButton>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, highlight, icon }) {
  return (
    <div
      className="premium-card"
      style={{
        padding: "30px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%"
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: highlight ? "#d4af37" : "#888",
        fontSize: "0.75rem",
        letterSpacing: "2px",
        fontWeight: "600"
      }}>
        <span style={{ fontSize: "1.2rem", color: highlight ? "#d4af37" : "rgba(212, 175, 55, 0.4)" }}>{icon}</span>
        {label}
      </div>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.6rem",
          color: highlight ? "#d4af37" : "white",
          margin: 0,
          lineHeight: 1.2
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function GoldButton({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "18px 45px",
        background: hover ? "var(--gold-gradient)" : "#d4af37",
        color: "#000",
        border: "none",
        borderRadius: "100px",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "800",
        fontSize: "1.1rem",
        letterSpacing: "2px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: hover ? "translateY(-5px) scale(1.05)" : "none",
        boxShadow: hover ? "0 15px 40px rgba(212, 175, 55, 0.4)" : "0 5px 20px rgba(0,0,0,0.3)"
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "18px 45px",
        background: hover ? "rgba(212, 175, 55, 0.1)" : "transparent",
        border: "1px solid #d4af37",
        color: "#d4af37",
        borderRadius: "100px",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: "800",
        fontSize: "1.1rem",
        letterSpacing: "2px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover ? "0 10px 30px rgba(0,0,0,0.4)" : "none"
      }}
    >
      {children}
    </button>
  );
}


export default LiveStatus;
