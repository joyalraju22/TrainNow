import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiAlertCircle, FiLoader, FiArrowLeft } from "react-icons/fi";
import { useToast } from "../contexts/ToastContext";
import { validateForm } from "../utils/validators";
import authService from "../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateLoginForm = () => {
    const formData = { username, password };

    if (isAdmin) {
      if (!username.trim() || !password.trim()) {
        setErrors({ general: "Admin ID and password are required" });
        return false;
      }
    } else {
      const validationRules = {
        username: [
          {
            validate: (value) => value && value.trim().length > 0,
            message: "Username is required",
          },
        ],
        password: [
          {
            validate: (value) => value && value.trim().length > 0,
            message: "Password is required",
          },
        ],
      };

      const { isValid, errors: validationErrors } =
        validateForm(formData, validationRules);

      if (!isValid) {
        setErrors(validationErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setLoading(true);

    try {
      // Check if user is trying to login as admin
      if (isAdmin) {
        // For admin, check against admin credentials
        const adminUsername = "admin";
        const adminPassword = "admin123";

        if (username === adminUsername && password === adminPassword) {
  // ✅ Set proper admin flag for protection
  localStorage.setItem("isAdmin", "true");
  localStorage.setItem("token", "admin_token");
  localStorage.setItem(
    "user",
    JSON.stringify({ username: "admin", role: "admin" })
  );

  showSuccess("Admin login successful! 🎉");

  setTimeout(() => {
    navigate("/admin/dashboard");   // 👈 DIRECT TO ADMIN DASHBOARD
    setLoading(false);
  }, 1200);
} else {
          showError("Invalid admin credentials");
          setLoading(false);
        }
      } else {
        // Call backend login endpoint
        try {
          const data = await authService.login({ username: username.trim(), password });
          // Expecting { token, user }
          if (data && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user || { username }));
            showSuccess("Login successful! 🎉");
            setTimeout(() => {
              navigate("/");
              setLoading(false);
            }, 1200);
          } else {
            throw new Error((data && data.message) || "Invalid login response");
          }
        } catch (err) {
          showError(err && err.message ? err.message : "Login failed. Check credentials.");
          setLoading(false);
        }
      }
    } catch (error) {
      showError("An error occurred. Try again.");
      console.error(error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
          maxWidth: "440px",
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
          {isAdmin ? "Admin " : "Welcome "}
          <span style={{ color: "#d4af37" }}>
            {isAdmin ? "Access" : "Back"}
          </span>
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
          <FiLogIn size={18} />
          Continue your railway journey
        </p>

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="username"
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#c5a868",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {isAdmin ? "Admin ID" : "Username"}
          </label>
          <input
            id="username"
            type="text"
            placeholder={isAdmin ? "Enter admin ID" : "Enter your username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: errors.username ? "2px solid #ef4444" : "1.5px solid rgba(212,175,55,0.3)",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              fontSize: "0.95rem",
              color: "white",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "text",
            }}
            onFocus={(e) => {
              if (!errors.username) {
                e.target.style.borderColor = "#d4af37";
                e.target.style.boxShadow = "0 0 0 2px rgba(212,175,55,0.2)";
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.username ? "#ef4444" : "rgba(212,175,55,0.3)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          />
          {errors.username && (
            <span
              id="username-error"
              style={{
                display: "block",
                color: "#fecaca",
                fontSize: "0.8rem",
                marginTop: "6px",
                fontWeight: "500",
              }}
            >
              {errors.username}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#c5a868",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: errors.password ? "2px solid #ef4444" : "1.5px solid rgba(212,175,55,0.3)",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              fontSize: "0.95rem",
              color: "white",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "text",
            }}
            onFocus={(e) => {
              if (!errors.password) {
                e.target.style.borderColor = "#d4af37";
                e.target.style.boxShadow = "0 0 0 2px rgba(212,175,55,0.2)";
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.password ? "#ef4444" : "rgba(212,175,55,0.3)";
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          />
          {errors.password && (
            <span
              id="password-error"
              style={{
                display: "block",
                color: "#fecaca",
                fontSize: "0.8rem",
                marginTop: "6px",
                fontWeight: "500",
              }}
            >
              {errors.password}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            padding: "12px",
            background: "rgba(212,175,55,0.1)",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => setIsAdmin(!isAdmin)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsAdmin(!isAdmin);
          }}
          role="checkbox"
          aria-checked={isAdmin}
          tabIndex="0"
        >
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            style={{
              cursor: "pointer",
              width: "18px",
              height: "18px",
              accentColor: "#d4af37",
            }}
          />
          <label
            style={{
              color: "#c5a868",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              margin: 0,
            }}
          >
            Admin Login
          </label>
        </div>

        {errors.general && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              borderRadius: "10px",
              color: "#fecaca",
              fontSize: "0.9rem",
            }}
          >
            <FiAlertCircle size={18} />
            {errors.general}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            background:
              "linear-gradient(135deg, #d4af37 0%, #f5d27a 100%)",
            color: "#000",
            fontSize: "1rem",
            fontWeight: "700",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: loading ? 0.7 : 1,
            transform: loading ? "scale(0.98)" : "scale(1)",
            boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.boxShadow = "0 15px 35px rgba(212, 175, 55, 0.5)";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.boxShadow = "0 10px 25px rgba(212, 175, 55, 0.3)";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? (
            <>
              <FiLoader size={20} style={{ animation: "spin 1s linear infinite" }} />
              Logging in...
            </>
          ) : (
            <>
              <FiLogIn size={20} />
              Sign In
            </>
          )}
        </button>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "28px",
            borderTop: "1px solid rgba(212,175,55,0.2)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.9rem",
              margin: "0 0 12px 0",
            }}
          >
            Don't have an account?
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#d4af37",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212, 175, 55, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FiArrowLeft size={16} />
            Create one now
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
