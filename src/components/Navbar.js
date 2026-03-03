import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated, logoutUser } from "../utils/auth";
import { MdKeyboardArrowDown } from "react-icons/md";


function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [logoHover, setLogoHover] = useState(false);
  const [animateNav, setAnimateNav] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateNav(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);


  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav
      style={{
        ...navbarStyle,

        opacity: animateNav ? 1 : 0,
        background: animateNav
          ? navbarStyle.background
          : "transparent",
        transform: animateNav ? "translateY(0)" : "translateY(-40px)",
        transition: "all 1s ease"
      }}
    >

      {/* LOGO */}
      <div
        style={{
          ...logoWrapper,
          opacity: animateNav ? 1 : 0,
          transform: animateNav ? "translateX(0)" : "translateX(-30px)",
          transition: "all 1.2s ease"
        }}
      >

        <Link
          to="/"
          style={{
            ...logoLink,
            transform: logoHover ? "scale(1.04)" : "scale(1)",
            transition: "all 0.35s ease"
          }}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <img
            src={`${process.env.PUBLIC_URL}/logo-icon.png`}
            alt="TrainNow Logo"
            style={{
              ...logoImage,
              filter: logoHover
                ? "drop-shadow(0 0 8px rgba(212,175,55,0.6))"
                : "none"
            }}
          />

          <span
            style={{
              ...logoText,
              background: "linear-gradient(90deg, #d4af37, #f5d27a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: logoHover
                ? "0 0 12px rgba(212,175,55,0.5)"
                : "none"
            }}
          >
            TrainNow
          </span>
        </Link>
      </div>


      {/* NAV LINKS */}
      {/* NAV LINKS */}
      <div
        style={{
          ...linksContainer,
          opacity: animateNav ? 1 : 0,
          transform: animateNav ? "translateX(0)" : "translateX(30px)",
          transition: "all 1.3s ease",
          transitionDelay: "0.2s"
        }}
      >


        {/* Primary */}
        <NavLink to="/" label="Home" />

        {/* Services Dropdown */}
        <div
          style={dropdownWrapper}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span style={{
            ...navLinkStyle,
            color: dropdownOpen ? "#eab506" : "#ffffff"
          }}>
            Services <MdKeyboardArrowDown style={{
              verticalAlign: "middle",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease"
            }} />
          </span>

          {dropdownOpen && (
            <div style={dropdownMenu}>
              <Link to="/track-trains" style={dropdownItem}>
                Track Trains
              </Link>
              <Link to="/live-status" style={dropdownItem}>
                Live Status
              </Link>
              <Link to="/route-map" style={dropdownItem}>
                Route Map
              </Link>
            </div>
          )}
        </div>

        {/* Utility */}
        <NavLink to="/help" label="Help" />

        {isLoggedIn ? (
          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={loginButton}>
            Login
          </Link>
        )}
      </div>

    </nav>
  );
}

/* Reusable NavLink Component */
function NavLink({ to, label }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...navLinkStyle,
        color: hover ? "#eab506" : "#ffffff",
        textShadow: hover
          ? "0 0 6px rgba(212,175,55,0.6)"
          : "none"
      }}
    >
      {label}
    </Link>
  );
}


/* ================= STYLES ================= */

const navbarStyle = {
  position: "fixed",
  top: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px 8% 80px 8%",
  background: `
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.63) 0%,
      rgba(0, 0, 0, 0.84) 20%,
      rgb(0, 0, 0) 40%,
      rgba(0, 0, 0, 0.84) 65%,
      rgba(0, 0, 0, 0) 85%,
      rgba(0, 0, 0, 0) 100%
    )
  `,
  zIndex: 1000
};


const linksContainer = {
  display: "flex",
  gap: "30px",
  alignItems: "center"
};

const navLinkStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  textDecoration: "none",
  color: "#ffffff",
  fontWeight: 500,
  fontSize: "1rem",
  letterSpacing: "1px",
  transition: "all 0.3s ease",
  position: "relative"
};


const loginButton = {
  fontFamily: "'Cormorant Garamond', serif",
  padding: "10px 18px",
  background: "#c79a29",
  color: "#000",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "1.05rem",
  letterSpacing: "1px",
  transition: "0.3s"
};


const logoutButton = {
  padding: "10px 18px",
  background: "transparent",
  border: "1px solid #d4af37",
  color: "#b8941e",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.3s"
};

const logoWrapper = {
  display: "flex",
  alignItems: "center"
};

const logoLink = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  textDecoration: "none",
  cursor: "pointer"
};

const logoImage = {
  height: "60px",   // smaller icon
  width: "60px",
  objectFit: "contain",
  transition: "all 0.3s ease"
};

const logoText = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "1.55rem",   // slightly smaller text
  fontWeight: "500",
  color: "#d4af37",
  letterSpacing: "2px",
  lineHeight: "1",
  transition: "all 0.3s ease"
};

const dropdownWrapper = {
  position: "relative",
  cursor: "pointer",
  paddingBottom: "15px", // Bridge the gap
  marginBottom: "-15px"  // Compensate for padding
};

const dropdownMenu = {
  position: "absolute",
  top: "100%",
  left: 0,
  background: "rgba(15,20,28,0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(212,175,55,0.4)",
  borderRadius: "10px",
  padding: "10px 0",
  minWidth: "180px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  marginTop: "-5px", // Slight overlap to ensure continuous hover
  zIndex: 1001
};

const dropdownItem = {
  display: "block",
  padding: "12px 20px",
  color: "#ffffff",
  textDecoration: "none",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "1rem",
  transition: "all 0.25s ease",
  borderLeft: "2px solid transparent"
};



export default Navbar;
