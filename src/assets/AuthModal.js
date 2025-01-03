import "../Styles/authmodel.css"
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";


const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login/Register

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div id="auth-modal-overlay">
      <div id="auth-modal-content">
        <button id="auth-modal-close-btn" onClick={onClose}>
          X
        </button>
        {isRegister ? (
          <Register toggleForm={toggleForm} />
        ) : (
          <Login toggleForm={toggleForm} />
        )}
      </div>
    </div>

  );
};

export default AuthModal;
