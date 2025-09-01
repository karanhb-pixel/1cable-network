
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar({ user, onLogout }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = React.useRef();
  // console.log(user);
  
  const handleDropdown = (open) => {
    if (open) {
      clearTimeout(dropdownTimeout.current);
      setDropdownOpen(true);
    } else {
      dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
    }
  };
  
  
  return (
    <>
      {/* <!-- Header Section --> */}
      <header className="header-section">
        <div className="header-container">
          {/* <!-- Logo with SVG --> */}
          <Link to="/" className="logo-group" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src="/images/logo-1.png"
              alt="1cable Network Logo"
              className="logo-img"
              loading="lazy"
              decoding="async"
            />
            <span className="logo-title">1cable</span>
            <span className="logo-sub">NETWORK</span>
          </Link>
          {/* <!-- Navigation --> */}
          <nav className="nav-links">
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
                    <a href="/#additional-services" className="dropdown-item">
                      Additional Services
                    </a>
                  </li>
                </ul>
              )}
            </div>
            <a href="/Posts">Posts</a>
            <a href="/#contact">Contact</a>
            <a href="/#renewal">Renewal</a>
            {user ? (
              <div className="nav-user-info">
                <Link to="/user" className="nav-user-link">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_nicename)}`} alt="User" className="nav-user-avatar" />
                  <span className="nav-user-name">{user.user_nicename}</span>
                </Link>
                <button onClick={onLogout} className="nav-logout-btn">Logout</button>
              </div>
            ) : (
              <Link to="/user" className="nav-link">User</Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
