import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../assets/firebase";
import AuthModal from "../assets/AuthModal";
import LanguageSelector from './Dashboard/LangugaeSelector';
import AddApp from "./AddContact/AddApp";
import TotalContacts from "./TotalConatcts/TotalContacts";
import Favorites from "./Dashboard/Favorites";
import ImportExport from './Dashboard/ImportExport';
import Sidebar from "./Sidebar";
import DynamicCalendar from './Dashboard/Calendar';
import ThemeToggle from './ThemeToggle';
import Home from './Dashboard/Home';
import { ThemeProvider } from "../ThemeContext";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    if (!user && !isLoading) {
      timer = setTimeout(() => {
        setShowModal(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!user) {
    return showModal ? <AuthModal onClose={() => setShowModal(false)} /> : null;
  }

  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/add-contact" element={<ProtectedRoute><AddApp /></ProtectedRoute>} />
      <Route path="/totalcontacts" element={<ProtectedRoute><TotalContacts /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/importexport" element={<ProtectedRoute><ImportExport /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><DynamicCalendar /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-content">
            <div className="top-bar">
              <ThemeToggle />
              <LanguageSelector />
            </div>
            <AppContent />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;