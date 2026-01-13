import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/crypto";
import { loginUser } from "../utils/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("No account found. Please register first.");
    return;
  }

  const user = JSON.parse(storedUser);

  // 🔐 PASSWORD CHECK (THIS IS WHERE YOUR CODE GOES)
  if (
    username !== user.username ||
    hashPassword(password) !== user.password
  ) {
    alert("Invalid username or password");
    return;
  }

  alert("Login successful!");
  loginUser(user);
  navigate("/");
};


  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtext">Sign in to continue</p>

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

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
