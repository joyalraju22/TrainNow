import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  // ✅ Used stats to drive the UI and setStats to load data
  const [stats, setStats] = useState({ trains: 0, users: 0, status: "Active" });

  /* 🔒 ADMIN PROTECTION & DATA LOADING */
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/login");
      return;
    }

    // Load actual counts from localStorage
    const savedTrains = JSON.parse(localStorage.getItem("adminTrains")) || [];
    const userCount = localStorage.getItem("user") ? 1 : 0;

    // ✅ Calling setStats to resolve the 'no-unused-vars' warning
    setStats({
      trains: savedTrains.length,
      users: userCount,
      status: "Operational"
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: "260px", background: "#1e293b", color: "white", padding: "24px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", color: "#38bdf8" }}>TrainNow</h2>
          <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>Admin Control Panel</p>
        </div>
        
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="sidebar-link active">📊 Dashboard</button>
          <button className="sidebar-link" onClick={() => navigate("/admin/trains")}>🚆 Manage Trains</button>
          <button className="sidebar-link">🛣️ Manage Routes</button>
          <button className="sidebar-link">👥 User Management</button>
        </nav>

        <button 
          onClick={handleLogout}
          style={{ background: "#ef4444", color: "white", border: "none", padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
        >
          Logout Admin
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: "40px" }}>
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "1.8rem", color: "#0f172a" }}>System Overview</h1>
          <p style={{ color: "#64748b" }}>Real-time statistics for the railway network.</p>
        </header>

        {/* METRICS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          
          <div className="metric-card">
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>TOTAL TRAINS</span>
            <div style={{ fontSize: "2rem", fontWeight: "700", margin: "10px 0" }}>{stats.trains}</div>
            <span style={{ color: "#10b981", fontSize: "0.8rem" }}>● Currently in database</span>
          </div>

          <div className="metric-card">
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>REGISTERED USERS</span>
            <div style={{ fontSize: "2rem", fontWeight: "700", margin: "10px 0" }}>{stats.users}</div>
            <span style={{ color: "#3b82f6", fontSize: "0.8rem" }}>● Active accounts</span>
          </div>

          <div className="metric-card">
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>SYSTEM STATUS</span>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", margin: "10px 0", color: "#10b981" }}>{stats.status}</div>
            <div className="pulse-indicator"></div>
          </div>

        </div>
      </main>

      <style>{`
        .sidebar-link { background: transparent; border: none; color: #94a3b8; padding: 12px; text-align: left; cursor: pointer; border-radius: 6px; transition: 0.2s; }
        .sidebar-link:hover { background: #334155; color: white; }
        .sidebar-link.active { background: #38bdf8; color: #0f172a; font-weight: bold; }
        
        .metric-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
        
        .pulse-indicator { width: 8px; height: 8px; background: #10b981; border-radius: 50%; position: absolute; top: 24px; right: 24px; box-shadow: 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); } }
      `}</style>
    </div>
  );
}

export default AdminDashboard;