import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/authmodel.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";

const Login = ({ toggleForm, onAuthStateChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Set up authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (onAuthStateChange) {
          onAuthStateChange(true);
        }
      } else {
        setIsAuthenticated(false);
        if (onAuthStateChange) {
          onAuthStateChange(false);
        }
      }
      setIsLoading(false); // Set loading to false after auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [onAuthStateChange]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Logged in successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess("Logged in with Google successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  // Don't render anything while checking auth state
  if (isLoading) {
    return null;
  }

  // If user is already authenticated, don't show the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div id="login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
      <button id="google-login-btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>
      <button onClick={toggleForm}>Switch to Register</button>
      <button id="forgot-password-btn" onClick={handlePasswordReset}>
        Forgot Password?
      </button>
    </div>
  );
};

export default Login;