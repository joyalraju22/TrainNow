  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

  function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ trains: 0, users: 0 });

    /* 🔒 ADMIN PROTECTION */
    useEffect(() => {
      if (!localStorage.getItem("isAdmin")) {
        navigate("/login");
        return;
      }

      const savedTrains =
        JSON.parse(localStorage.getItem("adminTrains")) || [];
      const userCount = localStorage.getItem("user") ? 1 : 0;

      setStats({
        trains: savedTrains.length,
        users: userCount,
      });
    }, [navigate]);

    const handleLogout = () => {
      localStorage.removeItem("isAdmin");
      navigate("/login");
    };

    const getSystemHealth = () => {
      if (stats.trains > 0)
        return { color: "#10b981", text: "Healthy", icon: "✓" };
      return { color: "#f59e0b", text: "Limited Data", icon: "⚠" };
    };

    const health = getSystemHealth();

    /* ===== STYLES ===== */

    const glassCardStyle = {
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(212,175,55,0.3)",
      borderRadius: "18px",
      padding: "40px",
      textAlign: "center",
      boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
    };

    const glassPanelStyle = {
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(212,175,55,0.3)",
      borderRadius: "18px",
      padding: "40px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
    };

    const cardTitle = {
      fontSize: "1rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#d4af37",
      marginBottom: "15px",
    };

    const bigNumber = {
      fontSize: "3rem",
      fontWeight: "700",
    };

    const goldButtonStyle = {
      padding: "14px 28px",
      background: "linear-gradient(135deg, #d4af37, #b8962e)",
      color: "#000",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
    };

    /* ===== RETURN ===== */

    return (
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          color: "white",
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
            zIndex: 0,
          }}
        >
          <source
            src={`${process.env.PUBLIC_URL}/videos/hero.mp4`}
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.6) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "100px 5%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.8rem", fontWeight: "700" }}>
              Admin <span style={{ color: "#d4af37" }}>Control Panel</span>
            </h1>

            <button
              onClick={handleLogout}
              style={{
                padding: "12px 20px",
                background: "rgba(255,0,0,0.15)",
                border: "1px solid #ef4444",
                color: "#ef4444",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              marginBottom: "50px",
            }}
          >
            <div style={glassCardStyle}>
              <h3 style={cardTitle}>Total Trains</h3>
              <p style={bigNumber}>{stats.trains}</p>
            </div>

            <div style={glassCardStyle}>
              <h3 style={cardTitle}>Registered Users</h3>
              <p style={bigNumber}>{stats.users}</p>
            </div>

            <div style={glassCardStyle}>
              <h3 style={cardTitle}>System Status</h3>
              <p style={{ ...bigNumber, color: health.color }}>
                {health.icon} {health.text}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={glassPanelStyle}>
            <h2 style={{ marginBottom: "25px", fontSize: "1.5rem" }}>
              Quick <span style={{ color: "#d4af37" }}>
                Admin Actions
              </span>
            </h2>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/admin/trains")}
                style={goldButtonStyle}
              >
                Manage Trains
              </button>

              <button
                onClick={() => navigate("/")}
                style={goldButtonStyle}
              >
                View Public Site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default AdminDashboard;