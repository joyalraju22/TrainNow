import { Link } from "react-router-dom";

/**
 * 404 Not Found page
 * Displayed when user navigates to non-existent route
 */
function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        padding: "50px 40px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        maxWidth: "500px"
      }}>
        <h1 style={{ fontSize: "5rem", margin: "0 0 16px 0" }}>404</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px", fontWeight: 600 }}>Page Not Found</h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "32px", opacity: 0.9, lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{
              padding: "12px 32px",
              background: "white",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "inline-block"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            🏠 Go Home
          </Link>

          <Link
            to="/search"
            style={{
              padding: "12px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "1rem",
              border: "2px solid white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "inline-block"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
          >
            🚆 Search Trains
          </Link>
        </div>

        <p style={{ marginTop: "32px", opacity: 0.7, fontSize: "0.9rem" }}>
          Error Code: 404 · Page Not Found
        </p>
      </div>
    </div>
  );
}

export default NotFound;
