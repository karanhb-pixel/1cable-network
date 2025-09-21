import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useUser } from "../../utils/useUser";
import "./navbar.css";

const Navbar = React.memo(() => {
  const dispatch = useDispatch();
  const user = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = React.useRef();

  // Memoize isAdmin calculation to avoid recalculation on every render
  const isAdmin = useMemo(() => {
    return user?.user_role?.includes('administrator') || false;
  }, [user?.user_role]);

  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    dispatch(setUser(null));
  }, [dispatch]);

  // Memoize the dropdown handler to prevent unnecessary re-renders
  const handleDropdown = useCallback((open) => {
    if (open) {
      clearTimeout(dropdownTimeout.current);
      setDropdownOpen(true);
    } else {
      dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
    }
  }, []);

  // Memoize the user avatar URL to avoid recalculation
  const userAvatarUrl = useMemo(() => {
    if (!user?.user_nicename) return '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_nicename)}`;
  }, [user?.user_nicename]);
  

  return (
    <>
      {/* <!-- Header Section --> */}
      <header className="header-section">
        <div className="header-container">
          {/* <!-- Logo with SVG --> */}
          <Link
            to="/"
            className="logo-group"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src="/images/logo-1.avif"
              alt="1cable Network Logo"
              className="logo-img"
              loading="lazy"
              decoding="async"
            />
          </Link>
          {/* <!-- Navigation --> */}
          <nav className="nav-links">
            {!isAdmin ? (
              <>
                <div
                  className="nav-dropdown"
                  onMouseEnter={() => handleDropdown(true)}
                  onMouseLeave={() => handleDropdown(false)}
                  tabIndex={0}
                  onFocus={() => handleDropdown(true)}
                  onBlur={() => handleDropdown(false)}
                >
                  <a
                    href="/#plans"
                    className="nav-link nav-link-dropdown"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    Plans ▾
                  </a>
                  {dropdownOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <a href="/#plans" className="dropdown-item">
                          Wifi Services
                        </a>
                      </li>
                      <li>
                        <a href="/#ott-services" className="dropdown-item">
                          OTT Services
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#additional-services"
                          className="dropdown-item"
                        >
                          Additional Services
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
                <a href="/#contact">Contact</a>
                <a href="/#renewal">Renewal</a>
              </>
            ) : (
              <>
                <a href="/add_User">Add User</a>
                
                <a href="/show_Wifi_plans_2">Show Wifi_plans</a>

                <a href="/ott_plan">Show Ott_plans</a>
              </>
            )}


            {user ? (
              <div className="nav-user-info">
                <Link to="/user" className="nav-user-link">
                  <img
                    src={userAvatarUrl}
                    alt="User"
                    className="nav-user-avatar"
                  />
                  <span className="nav-user-name">{user.user_nicename}</span>
                </Link>
                <button onClick={handleLogout} className="nav-logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/user" className="nav-link">
                User
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
