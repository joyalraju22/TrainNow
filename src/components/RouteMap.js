import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import trainService from "../services/trainService";
import { MdTrain } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

function RouteMap() {
  const [train, setTrain] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showError: showErrorToast } = useToast();

  const loadRoute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const selected = localStorage.getItem("selectedTrain");
      if (!selected) {
        setTrain(null);
        return;
      }

      const trainData = await trainService.getTrainRoute(selected);
      if (trainData) {
        setTrain({ ...trainData, trainNumber: selected });
      }

      const live = await trainService.getTrainLiveStatus(selected);
      setLiveData(live);

    } catch (err) {
      setError("Failed to load route information");
      showErrorToast("Error loading route");
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  useEffect(() => {
    loadRoute();
    const interval = setInterval(async () => {
      const selected = localStorage.getItem("selectedTrain");
      if (selected) {
        const live = await trainService.getTrainLiveStatus(selected);
        setLiveData(live);
      }
    }, 2000); // Higher frequency for smooth movement
    return () => clearInterval(interval);
  }, [loadRoute]);

  const handleNavigateToSearch = () => {
    navigate("/");
  };

  const getCurrentStationIndex = () => {
    if (!liveData?.currentStation || !train?.route) return -1;
    return train.route.findIndex(s => s.station === liveData.currentStation);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes trainPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes snakePulse {
      0% { r: 6; opacity: 1; stroke-width: 0; }
      50% { r: 10; opacity: 0.5; stroke-width: 10; }
      100% { r: 6; opacity: 1; stroke-width: 0; }
    }
  `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        padding: "80px 8% 40px",
        minHeight: "100vh",
        background: "#000",
        color: "white"
      }}
    >


      {/* PAGE HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            color: "#d4af37",
            marginBottom: "6px",
          }}
        >
          Train Route Map
        </h1>

        <p style={{ color: "#aaa", fontSize: "0.95rem" }}>
          Complete station sequence and journey progress
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading route information...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="live-status-container">
          <div className="alert alert-error">
            <IoWarning size={20} style={{ color: "#ef4444", marginRight: "10px" }} />
            <div className="alert-content">
              <strong>{error}</strong>
              <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                Please search for a train first to view its route information.
              </p>
            </div>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              className="action-btn btn-primary"
              onClick={handleNavigateToSearch}
               z={{ minWidth: "200px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            >
              <FaArrowLeft /> Search for a Train
            </button>
          </div>
        </div>
      )}






      {/* ROUTE INFORMATION */}
      {train && !loading && !error && (
        <div style={{ marginTop: "40px" }}>

          {/* LUXURY TRAIN HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg,#0f1720,#0b0f15)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "16px",
              padding: "20px 30px",
              marginBottom: "35px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)"
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.6rem",
                color: "#FFD700",
                letterSpacing: "0.5px",
                marginBottom: "6px"
              }}
            >
              {train.name}
            </h2>

            <p style={{ color: "#aaa", fontSize: "1rem" }}>
              Train No: {train.trainNumber}
            </p>
          </div>

          {/* PREMIUM RAILWAY TRACK */}
          <div style={{ position: "relative", paddingLeft: "120px" }}>

            {/* Elegant Vertical Line (Interactive SVG Snake) */}
            <div
              style={{
                position: "absolute",
                left: "55px",
                top: "10px",
                bottom: "75px",
                width: "6px",
                zIndex: 1
              }}
            >
              <svg width="6" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                {/* Background Line (Base Track) */}
                <line
                  x1="3" y1="0" x2="3" y2="100%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />

                {/* Glowing Traversed Path */}
                {(() => {
                  const currentIndex = getCurrentStationIndex();
                  const totalStops = train.route.length;
                  if (currentIndex === -1) return null;

                  const percentage = (currentIndex / (totalStops - 1)) * 100;
                  const progressOffset = liveData?.status === "Running"
                    ? (parseFloat(liveData.progressPercentage || 0) / (totalStops - 1))
                    : 0;
                  const totalPercentage = Math.min(percentage + progressOffset, 100);

                  return (
                    <>
                      <line
                        x1="3" y1="0" x2="3" y2={`${totalPercentage}%`}
                        stroke="#FFD700"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ transition: "y2 2s linear", filter: "drop-shadow(0 0 8px #FFD700)" }}
                      />
                      {/* Neon Pulse Tip */}
                      <circle
                        cx="3" cy={`${totalPercentage}%`} r="6"
                        fill="#FFD700"
                        style={{
                          transition: "cy 2s linear",
                          filter: "drop-shadow(0 0 12px #FFD700)",
                          animation: "snakePulse 2s infinite ease-in-out"
                        }}
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            {train.route.map((stop, index) => {
              const currentIndex = getCurrentStationIndex();
              const isCurrent = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    marginBottom: "30px"
                  }}
                >
                  {/* Circular Station Node */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-74px",
                      top: "10px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: isCurrent
                        ? "#2ecc71"
                        : isCompleted
                          ? "#d4af37"
                          : "#1e293b",
                      border: "3px solid #000",
                      boxShadow: isCurrent
                        ? "0 0 20px #2ecc71"
                        : isCompleted
                          ? "0 0 10px #d4af37"
                          : "none",
                      transition: "0.4s ease"
                    }}
                  />

                  {/* Moving Train Animation */}
                  {isCurrent && (
                    <div
                      style={{
                        position: "absolute",
                        left: "-110px",
                        top: liveData?.status === "Running"
                          ? `${10 + (parseFloat(liveData.progressPercentage || 0) / 100) * 100}px`
                          : "10px",
                        fontSize: "1.8rem",
                        transition: "top 2s linear",
                        zIndex: 10,
                        animation: liveData?.status === "Running" ? "none" : "trainPulse 2s infinite",
                        color: "#FFD700",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <MdTrain />
                    </div>
                  )}

                  {/* Station Card */}
                  <div
                    style={{
                      background: "rgba(20,25,35,0.8)",
                      padding: "16px 24px",
                      borderRadius: "14px",
                      border: "1px solid rgba(212,175,55,0.2)",
                      backdropFilter: "blur(8px)"
                    }}
                  >

                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.1rem",
                        color: isCurrent
                          ? "#2ecc71"
                          : isCompleted
                            ? "#FFD700"
                            : "white",
                        marginBottom: "4px",
                        textShadow: isCurrent ? "0 0 12px rgba(46, 204, 113, 0.4)" : "none"
                      }}
                    >
                      {stop.station}
                    </h3>

                    <p style={{ color: "#aaa", fontSize: "0.8rem" }}>
                      Arrival {stop.arr} • Departure {stop.dep}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "20px"
            }}
          >


            <button
              onClick={handleNavigateToSearch}
              style={{
                padding: "12px 28px",
                background: "transparent",
                border: "1px solid #d4af37",
                color: "#d4af37",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Search Another Train
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


export default RouteMap;
