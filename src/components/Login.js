import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/crypto";
import { loginUser } from "../utils/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // ✅ toggle
  const navigate = useNavigate();

  const handleLogin = () => {
    /* ================= USER LOGIN ================= */
    if (!isAdmin) {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("No account found. Please register first.");
        return;
      }

      const user = JSON.parse(storedUser);

      if (
        username !== user.username ||
        hashPassword(password) !== user.password
      ) {
        alert("Invalid username or password");
        return;
      }

      alert("User Login successful!");
      loginUser(user);
      navigate("/");
    }

    /* ================= ADMIN LOGIN ================= */
    else {
      /* ================= ADMIN LOGIN ================= */
if (username !== "admin" || password !== "admin123") {
  alert("Invalid admin credentials");
  return;
}

alert("Admin login successful!");

// ✅ CLEAR USER / TRAIN STATE
localStorage.removeItem("selectedTrain");
localStorage.removeItem("lastViewedRoute");
localStorage.removeItem("autoSearch");
localStorage.removeItem("lastTrainSearch");

// ✅ SET ADMIN FLAG
localStorage.setItem("isAdmin", "true");

// ✅ GO ONLY TO ADMIN DASHBOARD
navigate("/admin");

    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">

        <h2>{isAdmin ? "Admin Login" : "User Login"}</h2>
        <p className="auth-subtext">
          {isAdmin ? "Administrator access only" : "Sign in to continue"}
        </p>

        <input
          type="text"
          placeholder={isAdmin ? "Admin ID" : "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleLogin}>
          {isAdmin ? "Login as Admin" : "Login"}
        </button>

        {/* FOOTER */}
        {!isAdmin && (
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        )}

        {/* TOGGLE */}
        <div
          style={{
            marginTop: "18px",
            cursor: "pointer",
            fontWeight: 600,
            color: "#0f766e",
            textAlign: "center"
          }}
          onClick={() => {
            setIsAdmin(!isAdmin);
            setUsername("");
            setPassword("");
          }}
        >
          {isAdmin ? "← Back to User Login" : "Admin Login →"}
        </div>

      </div>
    </div>
  );
}

export default Login;
