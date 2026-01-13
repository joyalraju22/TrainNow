import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Show Navbar on all pages EXCEPT Home */}
      {location.pathname !== "/" && <Navbar />}
      <Outlet />
    </>
  );
}

export default Layout;