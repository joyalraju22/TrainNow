import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiZap, FiLoader, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../contexts/ToastContext";
import authService from "../services/authService";
 
function Registration() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Clear forms and validate localStorage on mount
  useEffect(() => {
    // Reset all form fields
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setPasswordStrength(null);
    
    // Initialize clean localStorage if needed
    try {
      const stored = localStorage.getItem("registeredUsers");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate it's an array with valid objects
        if (!Array.isArray(parsed)) {
          localStorage.setItem("registeredUsers", JSON.stringify([]));
        } else {
          // Filter out invalid entries
          const validUsers = parsed.filter(u => u && typeof u === 'object' && u.username && u.email);
          if (validUsers.length !== parsed.length) {
            localStorage.setItem("registeredUsers", JSON.stringify(validUsers));
          }
        }
      } else {
        localStorage.setItem("registeredUsers", JSON.stringify([]));
      }
    } catch (e) {
      // Reset if corrupted
      localStorage.setItem("registeredUsers", JSON.stringify([]));
    }
  }, []);

  const checkPasswordStrength = (value) => {
  setPassword(value);

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (!value) {
    setPasswordStrength(null);
  } else if (score <= 1) {
    setPasswordStrength({ label: "Weak", width: "33%" });
  } else if (score === 2 || score === 3) {
    setPasswordStrength({ label: "Medium", width: "66%" });
  } else {
    setPasswordStrength({ label: "Strong", width: "100%" });
  }
};


const validateRegistrationForm = () => {
  const newErrors = {};

  if (!email || email.trim() === "") {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email";
  }

  if (!username || username.trim() === "") {
    newErrors.username = "Username is required";
  } else if (username.trim().length < 3) {
    newErrors.username = "Username must be at least 3 characters";
  } else if (username.trim().length > 20) {
    newErrors.username = "Username must not exceed 20 characters";
  }

  if (!password || password.trim() === "") {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }

  if (!confirmPassword || confirmPassword.trim() === "") {
    newErrors.confirmPassword = "Please confirm your password";
  }

  if (password && confirmPassword && password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return false;
  }

  return true;
};

const handleRegister = async () => {
  if (!validateRegistrationForm()) return;

  setLoading(true);

  try {
    // Call backend register endpoint
    await authService.register({ username: username.trim(), email: email.trim(), password });

    // Clear form
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});

    showSuccess("Registration successful! Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 1200);

  } catch (error) {
    showError(error && error.message ? error.message : "An error occurred. Try again.");
    console.error("Registration error:", error);
    setLoading(false);
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleRegister();
  }
};

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #0b1625 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', sans-serif",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        background: "rgba(15, 20, 28, 0.75)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(212,175,55,0.5)",
        borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
        padding: "48px 40px",
        position: "relative",
      }}
    >
      {/* Gold Accent Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #d4af37 0%, #f5d27a 50%, #d4af37 100%)",
          borderRadius: "20px 20px 0 0",
        }}
      />

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.3rem",
          fontWeight: "600",
          marginBottom: "10px",
          color: "white",
        }}
      >
        Create <span style={{ color: "#d4af37" }}>Account</span>
      </h1>

      <p
        style={{
          color: "#b4860e",
          fontSize: "0.95rem",
          marginBottom: "28px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FiZap size={18} />
        Join TrainNow today
      </p>

      {/* EMAIL */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle(errors.email)}
        />
        {errors.email && <ErrorText message={errors.email} />}
      </div>

      {/* USERNAME */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>Username</label>
        <input
          type="text"
          placeholder="Choose username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle(errors.username)}
        />
        {errors.username && <ErrorText message={errors.username} />}
      </div>

      {/* PASSWORD */}
<div style={{ marginBottom: "18px" }}>
  <label style={labelStyle}>Password</label>

  <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Create password"
    value={password}
    onChange={(e) => checkPasswordStrength(e.target.value)}
    style={inputStyle(errors.password)}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#d4af37",
    }}
  >
    {showPassword ? <FiEyeOff /> : <FiEye />}
  </span>
</div>

  {errors.password && <ErrorText message={errors.password} />}

  {/* 🔥 PASSWORD STRENGTH BAR — ADD HERE */}
  {passwordStrength && (
    <div style={{ marginTop: "10px" }}>
      <div
        style={{
          height: "6px",
          background: "rgba(212,175,55,0.2)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: passwordStrength.width,
            background:
              "linear-gradient(90deg, #d4af37 0%, #f5d27a 100%)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "6px",
          fontSize: "0.8rem",
          color: "#d4af37",
        }}
      >
        Strength: {passwordStrength.label}
      </p>
    </div>
  )}
</div>

      {/* CONFIRM PASSWORD */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle(errors.confirmPassword)}
        />
        {errors.confirmPassword && (
          <ErrorText message={errors.confirmPassword} />
        )}
      </div>

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background:
            "linear-gradient(135deg, #d4af37 0%, #f5d27a 100%)",
          color: "#000",
          border: "none",
          borderRadius: "10px",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "0.3s",
          boxShadow: "0 15px 35px rgba(212,175,55,0.4)",
        }}
      >
        {loading ? (
          <>
            <FiLoader
              style={{ marginRight: 8, animation: "spin 1s linear infinite" }}
            />
            Creating...
          </>
        ) : (
          <>
            <FiCheck style={{ marginRight: 6 }} />
            Register
          </>
        )}
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "22px",
          color: "#9ca3af",
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#d4af37" }}>
          Sign In
        </Link>
      </p>
    </div>

    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);
}


const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#c5a868",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle = (error) => ({
  width: "100%",
  padding: "12px 16px",
  border: error
    ? "2px solid #ef4444"
    : "1.5px solid rgba(212,175,55,0.3)",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.05)",
  fontSize: "0.95rem",
  color: "white",
  transition: "all 0.3s ease",
  boxSizing: "border-box",
});

const ErrorText = ({ message }) => (
  <span
    style={{
      display: "block",
      color: "#fecaca",
      fontSize: "0.8rem",
      marginTop: "6px",
      fontWeight: "500",
    }}
  >
    {message}
  </span>
);


export default Registration;
