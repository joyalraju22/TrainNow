import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import { logoutUser } from "../utils/auth";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  setIsLoggedIn(isAuthenticated());
}, []);

  return (
    <div
      className="home fade-in"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/train-bg.jpg)`
      }}
    >
      {/* TOP BAR */}
      <header className="top-bar">
        {/* LEFT */}
        <div className="top-left">
          <img
            src={`${process.env.PUBLIC_URL}/logo (3).png`}
            alt="TrainNow"
            className="logo-img"
          />
          <span className="brand">TrainNow</span>
        </div>

        {/* CENTER → ONLY HOME + SEARCH */}
        <nav className="top-center">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/search" className="nav-link">Search</Link>
        </nav>

        {/* RIGHT */}
        <div className="top-right">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn outline">Register</Link>
            </>
          ) : (
            <button
              className="nav-btn outline"
              onClick={() => {
                logoutUser();
window.location.reload();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero-center">
        <div className="hero-glass fade-in-text">
          <p className="hero-text">
            Track your train status quickly, accurately, and effortlessly.
          </p>

          <Link
            to={isLoggedIn ? "/search" : "/login"}
            className="btn-primary"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
