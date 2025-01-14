import React from "react";
import "../Styles/Style.css";


const Header = ({ darkMode, toggleTheme }) => {
  return (
    <header className={`header ${darkMode ? "dark" : "light"}`}>
      <div className="header-content">
        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {darkMode ? "🌙" : "☀️"} {/* Sun/Moon emoji */}
        </button>

       
      </div>
    </header>
  );
};

export default Header;
