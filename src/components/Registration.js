import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/crypto";

function Registration() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !username || !password) {
      alert("All fields are required");
      return;
    }

    // basic email check
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    const userData = {
  email,
  username,
  password: hashPassword(password)
};
    localStorage.setItem("user", JSON.stringify(userData));

    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h2>Register</h2>
        <p className="auth-subtext">Create an account</p>

        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleRegister}>
          Register
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
