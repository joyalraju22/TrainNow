import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdTrain,
  MdDashboard,
  MdRoute,
  MdPeople,
  MdExitToApp,
  MdSettings,
  MdRefresh,
  MdCheckCircle,
  MdWarning
} from "react-icons/md";

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trains: 0, users: 0, searches: 0 });


  /* 🔒 ADMIN PROTECTION & DATA LOADING */
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/login");
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = () => {
    const savedTrains = JSON.parse(localStorage.getItem("adminTrains")) || [];
    const user = localStorage.getItem("user") ? 1 : 0;
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    setStats({
      trains: savedTrains.length,
      users: user,
      searches: recentSearches.length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const getSystemHealth = () => {
    if (stats.trains > 0) return { color: "#10b981", text: "Healthy", icon: <MdCheckCircle /> };
    return { color: "#f59e0b", text: "Limited Data", icon: <MdWarning /> };
  };

  const health = getSystemHealth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "280px",
        background: "#1e293b",
        color: "white",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "1.4rem", margin: "0 0 4px 0", color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdTrain /> TrainNow
          </h1>
          <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: "0", letterSpacing: "0.05em" }}>
            ADMIN DASHBOARD
          </p>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ opacity: 0.5, fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", marginBottom: "12px" }}>Management</div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "#38bdf8",
              color: "#0f172a",
              border: "none",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdDashboard /> Dashboard
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/trains")}
            style={{
              background: "transparent",
              color: "#cbd5e1",
              border: "none",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#334155"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#cbd5e1"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdTrain /> Manage Trains
            </div>
          </button>

          <button
            style={{
              background: "transparent",
              color: "#cbd5e1",
              border: "none",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "0.95rem",
              opacity: 0.6,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#334155"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#cbd5e1"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdRoute /> Routes (Coming Soon)
            </div>
          </button>

          <button
            style={{
              background: "transparent",
              color: "#cbd5e1",
              border: "none",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "0.95rem",
              opacity: 0.6,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#334155"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#cbd5e1"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdPeople /> Users (Coming Soon)
            </div>
          </button>
        </nav>

        <div style={{ borderTop: "1px solid #334155", paddingTop: "16px" }}>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#ef4444"; e.target.style.color = "white"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#ef4444"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyCenter: "center", gap: "10px" }}>
              <MdExitToApp /> Logout
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column" }}>
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", margin: "0 0 8px 0", color: "#0f172a", fontWeight: "700" }}>
            Control Panel
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: "0" }}>
            Manage and monitor your railway system
          </p>
        </header>

        {/* QUICK STATS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>

          {/* Trains Card */}
          <div style={{
            background: "white",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Trains</p>
                <p style={{ margin: "0", fontSize: "2.5rem", fontWeight: "700", color: "#0f172a" }}>{stats.trains}</p>
              </div>
              <span style={{ fontSize: "2.5rem", color: "#3b82f6" }}><MdTrain /></span>
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#10b981" }}>✓ In database</p>
          </div>

          {/* Users Card */}
          <div style={{
            background: "white",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Registered Users</p>
                <p style={{ margin: "0", fontSize: "2.5rem", fontWeight: "700", color: "#0f172a" }}>{stats.users}</p>
              </div>
              <span style={{ fontSize: "2.5rem", color: "#10b981" }}><MdPeople /></span>
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#3b82f6" }}>✓ Active account{stats.users !== 1 ? 's' : ''}</p>
          </div>

          {/* System Status Card */}
          <div style={{
            background: "white",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>System Status</p>
                <p style={{ margin: "0", fontSize: "1.5rem", fontWeight: "700", color: health.color }}>
                  {health.icon} {health.text}
                </p>
              </div>
              <span style={{ fontSize: "2.5rem", color: "#f59e0b" }}><MdSettings /></span>
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>Last updated: just now</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div style={{ background: "white", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: "600", color: "#0f172a" }}>Quick Actions</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/admin/trains")}
              style={{
                background: "#0052cc",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#003d99"}
              onMouseLeave={(e) => e.target.style.background = "#0052cc"}
            >
              + Add New Train
            </button>
            <button
              onClick={loadStats}
              style={{
                background: "#e2e8f0",
                color: "#1f2937",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#cbd5e1"}
              onMouseLeave={(e) => e.target.style.background = "#e2e8f0"}
            >
              <MdRefresh /> Refresh Stats
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
