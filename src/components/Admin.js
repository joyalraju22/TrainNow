import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  /* 🔒 ADMIN PROTECTION */
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="app fade-in">
      <h2>Admin Dashboard</h2>

      <div className="train-card">
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          Welcome, Administrator.  
          Use the controls below to manage the railway system.
        </p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <button
            className="gov-btn"
            onClick={() => navigate("/admin/trains")}
          >
            Manage Trains
          </button>

          <button
            className="gov-btn"
            onClick={() => navigate("/admin/routes")}
          >
            Manage Routes
          </button>

          <button
            className="gov-btn"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>

          <button
            className="gov-btn"
            style={{ backgroundColor: "#dc2626" }}
            onClick={() => {
              localStorage.removeItem("isAdmin");
              navigate("/login");
            }}
          >
            Logout Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
