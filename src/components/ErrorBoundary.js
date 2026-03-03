import React from "react";

/**
 * Error Boundary component to catch and handle errors
 * Prevents entire app from crashing due to component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px"
        }}>
          <div style={{
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "40px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)"
          }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️ Oops!</h1>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Something went wrong</h2>
            <p style={{ fontSize: "1rem", marginBottom: "24px", opacity: 0.9 }}>
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={this.resetError}
              style={{
                padding: "12px 32px",
                fontSize: "1rem",
                background: "white",
                color: "#667eea",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              Return to Home
            </button>
            {process.env.NODE_ENV === "development" && (
              <details style={{ marginTop: "24px", textAlign: "left", color: "#fff" }}>
                <summary style={{ cursor: "pointer", marginBottom: "12px" }}>Error Details</summary>
                <pre style={{ 
                  background: "rgba(0, 0, 0, 0.2)", 
                  padding: "12px", 
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "0.85rem"
                }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
