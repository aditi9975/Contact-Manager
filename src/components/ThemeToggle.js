import React, { useContext } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import { ThemeContext } from '../ThemeContext'; // Import the ThemeContext
import '../Styles/Style.css'; // Import the CSS for styling

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Access the context

  return (
    <button 
      className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`} 
      onClick={toggleTheme}
    >
      <FaSun className="icon Sun" />
      <FaMoon className="icon moon" />
      <div className="toggle-circle"></div>
    </button>
  );
};

export default ThemeToggle;
