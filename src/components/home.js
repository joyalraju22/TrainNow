import { useEffect, useState } from "react";
import stationsData from "../data/stations.json";
import trainsData from "../data/trains.js";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { MdStar } from "react-icons/md";
import { LuArrowLeftRight } from "react-icons/lu";


function Home() {
  const {
    activeTab, setActiveTab,
    departure, setDeparture,
    destination, setDestination,
    trainNumber, setTrainNumber
  } = useSearch();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const handleSwap = () => {
    setDeparture(destination);
    setDestination(departure);

    setDepartureStations([]);
    setDestinationStations([]);
  };

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteTrains");
    return saved ? JSON.parse(saved) : [];
  });


  const [departureFocused, setDepartureFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [trainNumberFocused, setTrainNumberFocused] = useState(false);

  const [departureStations, setDepartureStations] = useState([]);
  const [destinationStations, setDestinationStations] = useState([]);
  const [trainNumberStations, setTrainNumberStations] = useState([]);



  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDepartureStations(departure);
    }, 300);

    return () => clearTimeout(delay);
  }, [departure]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDestinationStations(destination);
    }, 300);

    return () => clearTimeout(delay);
  }, [destination]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTrainNumberStations(trainNumber);
    }, 300);

    return () => clearTimeout(delay);
  }, [trainNumber]);



  const fetchDepartureStations = (query = "") => {
    if (!query.trim()) {
      setDepartureStations(stationsData.slice(0, 8));
    } else {
      const filtered = stationsData.filter(
        s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
      );
      setDepartureStations(filtered);
    }
  };

  const fetchDestinationStations = (query = "") => {
    if (!query.trim()) {
      setDestinationStations(stationsData.slice(0, 8));
    } else {
      const filtered = stationsData.filter(
        s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
      );
      setDestinationStations(filtered);
    }
  };

  const fetchTrainNumberStations = (query = "") => {
    const lowerQuery = query.toLowerCase().trim();

    // Get Station Matches
    const stationMatches = stationsData.filter(
      s => s.name.toLowerCase().includes(lowerQuery) || s.code.toLowerCase().includes(lowerQuery)
    ).slice(0, 5).map(s => ({ ...s, type: 'station' }));

    // Get Train Matches
    const routes = typeof trainsData === 'object' && trainsData.default ? trainsData.default : trainsData;
    const trainMatches = Object.entries(routes)
      .filter(([number, train]) => number.includes(lowerQuery) || train.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map(([number, train]) => ({
        code: number,
        name: train.name,
        city: `${train.route[0].code} → ${train.route[train.route.length - 1].code}`,
        type: 'train'
      }));

    setTrainNumberStations([...trainMatches, ...stationMatches]);
  };

  const handleTrack = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // If oneway (train number or station search)
    if (activeTab === "oneway") {
      if (!trainNumber.trim()) return;
      navigate("/track-trains", {
        state: { trainNumber: trainNumber, from: departure, to: destination }
      });
    }

    // If round trip (stations)
    if (activeTab === "round") {
      if (!departure || !destination) return;
      navigate("/track-trains", {
        state: { from: departure, to: destination }
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        color: "white"
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.08)",
          animation: "slowZoom 20s ease-in-out infinite alternate",
          zIndex: 0
        }}


      >
        <source
          src="/videos/hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1
        }}
      />

      {/* Cinematic Edge Blur */}
      {/* Cinematic Blur + Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(2px)",
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Film Grain Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")`,
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 1
        }}
      />


      {/* Content Wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "120px 4%",
          maxWidth: "1600px",
          width: "100%"
        }}
      >
        {/* HERO TEXT */}
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            marginBottom: "20px",
            lineHeight: "1.2",

            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(50px)",
            transition: "all 1s ease"
          }}
        >


          Find your{" "}
          <span style={{ color: "#d4af37" }}>
            perfect journey
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "1.2rem",
            letterSpacing: "0.8px",
            color: "#c9c9c9",

            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(40px)",
            transition: "all 1.2s ease",
            transitionDelay: "0.2s"
          }}
        >


          Travel in comfort and elegance. Track your train journey instantly.
        </p>

        {/* QUICK ACCESS FAVORITES */}
        {favorites.length > 0 && (
          <div
            style={{
              marginTop: "40px",
              marginBottom: "40px",
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s ease",
              transitionDelay: "0.4s"
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
              color: "#FFD700",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase"
            }}>
              <MdStar style={{ fontSize: "1.1rem" }} /> Quick Access
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                overflowX: "auto",
                paddingBottom: "10px",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
              className="favorites-scroll"
            >
              {favorites.map((fav) => (
                <div
                  key={fav.number}
                  onClick={() => {
                    setTrainNumber(fav.number);
                    setActiveTab("oneway");
                  }}
                  style={{
                    flex: "0 0 auto",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 215, 0, 0.15)",
                    borderRadius: "14px",
                    padding: "14px 22px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    minWidth: "140px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.4)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    {fav.number}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    {fav.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "0px",

            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.3s ease",
            transitionDelay: "0.3s"
          }}
        >


          {[
            { id: "oneway", label: "Train No." },
            { id: "round", label: "Station Names" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 30px",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.08))"
                    : "rgba(255,255,255,0.05)",
                border:
                  activeTab === tab.id
                    ? "1px solid #d4af37"
                    : "1px solid rgba(255,255,255,0.1)",
                color: activeTab === tab.id ? "#d4af37" : "#ffffff",
                borderRadius: "12px 12px 0 0",
                cursor: "pointer",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                transform: activeTab === tab.id ? "translateY(-4px)" : "translateY(0)",
                boxShadow:
                  activeTab === tab.id
                    ? "0 10px 30px rgba(212,175,55,0.25)"
                    : "none"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.transform = "translateY(-3px)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BOOKING PANEL */}
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "18px",
            padding: "30px 40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            animation: animate ? "panelFadeUp 1.2s ease forwards" : "none"
          }}
        >

          {/* ================= ONE WAY → TRAIN NUMBER ================= */}
          {activeTab === "oneway" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "100%"
              }}
            >
              <div style={{ flex: 1, position: "relative", zIndex: 100 }}>
                <label style={{ fontSize: "0.8rem", color: "#c9c9c9" }}>
                  Train No. or Name
                </label>

                <input
                  type="text"
                  placeholder="Enter the train no. or name"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  onFocus={() => {
                    setTrainNumberFocused(true);
                    if (!trainNumber) fetchTrainNumberStations("");
                  }}
                  onBlur={() => {
                    setTimeout(() => setTrainNumberFocused(false), 200);
                  }}
                  style={inputStyle}
                />

                {trainNumberFocused && trainNumberStations.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {trainNumberStations.slice(0, 8).map((station) => (
                      <div
                        key={station._id || station.code}
                        style={suggestionItemStyle}
                        onClick={() => {
                          setTrainNumber(station.name);
                          setTrainNumberStations([]);
                        }}
                      >
                        <div style={{
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          color: "#FFD700",
                          minWidth: "60px"
                        }}>
                          {station.code}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {station.name}
                          </div>
                          <div style={{
                            fontSize: "0.72rem",
                            color: "#9ca3af",
                            marginTop: "2px"
                          }}>
                            {station.type === 'train' ? `Train: ${station.city}` : station.city}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={handleTrack}
                  style={{
                    padding: "16px 28px",
                    background: "linear-gradient(135deg, #d4af37, #b8962e)",
                    color: "#000",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "1px"
                  }}
                >
                  Track
                </button>
              </div>
            </div>
          )}

          {/* ================= ROUND → TRAIN STATIONS ================= */}
          {activeTab === "round" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                flexWrap: "nowrap"
              }}
            >

              {/* Departure */}
              <div style={{ flex: 1, position: "relative", zIndex: 100 }}>
                <label style={{ fontSize: "0.8rem", color: "#c9c9c9" }}>
                  Departure
                </label>

                <input
                  type="text"
                  placeholder="Enter departure station"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  onFocus={() => {
                    setDepartureFocused(true);
                    if (!departure) fetchDepartureStations("");
                  }}
                  onBlur={() => {
                    setTimeout(() => setDepartureFocused(false), 200);
                  }}
                  style={inputStyle}
                />

                {departureFocused && departureStations.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {departureStations.slice(0, 8).map((station) => (
                      <div
                        key={station._id}
                        style={suggestionItemStyle}
                        onClick={() => {
                          setDeparture(station.name);
                          setDepartureStations([]);
                        }}
                      >
                        <div style={{
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          color: "#FFD700",
                          minWidth: "50px"
                        }}>
                          {station.code}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {station.name}
                          </div>
                          <div style={{
                            fontSize: "0.72rem",
                            color: "#9ca3af",
                            marginTop: "2px"
                          }}>
                            {station.city}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap */}
              <div>
                <button
                  onClick={handleSwap}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#d4af37",
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <LuArrowLeftRight size={20} />
                </button>
              </div>

              {/* Destination */}
              <div style={{ flex: 1, position: "relative", zIndex: 100 }}>
                <label style={{ fontSize: "0.8rem", color: "#c9c9c9" }}>
                  Destination
                </label>

                <input
                  type="text"
                  placeholder="Enter destination station"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => {
                    setDestinationFocused(true);
                    if (!destination) fetchDestinationStations("");
                  }}
                  onBlur={() => {
                    setTimeout(() => setDestinationFocused(false), 200);
                  }}
                  style={inputStyle}
                />

                {destinationFocused && destinationStations.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {destinationStations.slice(0, 8).map((station) => (
                      <div
                        key={station._id}
                        style={suggestionItemStyle}
                        onClick={() => {
                          setDestination(station.name);
                          setDestinationStations([]);
                        }}
                      >
                        <div style={{
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          color: "#FFD700",
                          minWidth: "50px"
                        }}>
                          {station.code}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {station.name}
                          </div>
                          <div style={{
                            fontSize: "0.72rem",
                            color: "#9ca3af",
                            marginTop: "2px"
                          }}>
                            {station.city}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Track Button */}
              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={handleTrack}
                  style={{
                    padding: "16px 28px",
                    background: "linear-gradient(135deg, #d4af37, #b8962e)",
                    color: "#000",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Track
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  borderRadius: "10px",
  border: "1px solid rgba(0, 0, 0, 0.22)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  transition: "all 0.3s ease"
};

const suggestionBoxStyle = {
  position: "absolute",
  top: "108%",
  left: 0,
  width: "100%",
  maxHeight: "200px",   // 🔥 reduced from 280
  overflowY: "auto",
  background: "linear-gradient(145deg, rgba(12, 12, 18, 0.46), rgba(6, 4, 4, 0.6))",
  backdropFilter: "blur(14px)",
  borderRadius: "12px",   // 🔥 smaller radius
  border: "1px solid rgba(212,175,55,0.3)",
  boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
  zIndex: 99999,
};

const suggestionItemStyle = {
  padding: "9px 14px",     // 🔥 reduced padding
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",             // 🔥 smaller gap
  color: "white",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  transition: "all 0.2s ease",
};

export default Home;