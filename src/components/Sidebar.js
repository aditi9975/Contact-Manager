import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { db } from "../assets/firebase";
import ProfileButton from "../assets/ProfileButton";
import "../Styles/Style.css";

const Sidebar = () => {
  const [totalContacts, setTotalContacts] = useState(0);
  const [sidebarShrunk, setSidebarShrunk] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState(""); // New state to store user's name

  const profileIconRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTotalContacts = async () => {
      try {
        const contactsRef = ref(db, "contacts");
        const snapshot = await get(contactsRef);

        if (snapshot.exists()) {
          const contactsData = snapshot.val();
          const contactCount = Object.keys(contactsData).length;
          setTotalContacts(contactCount);
        } else {
          setTotalContacts(0);
        }
      } catch (error) {
        console.error("Error fetching contacts: ", error);
        setTotalContacts(0);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const userRef = ref(db, "users/12345"); // Replace with dynamic user ID
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfilePicture(userData.profilePicture);
          setUserName(userData.name); // Assuming the user's name is stored here
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchTotalContacts();
    fetchUserDetails();

    const handleClickOutside = (event) => {
      if (
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarShrunk(!sidebarShrunk);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderProfileIcon = () => {
    if (profilePicture) {
      return <img src={profilePicture} alt="Profile" className="profile-img" />;
    } else if (userName) {
      const firstLetter = userName.charAt(0).toUpperCase(); // Get the first letter of the name
      return <div className="default-profile-icon">{firstLetter}</div>; // Display the first letter
    } else {
      return <div className="default-profile-icon">👤</div>;
    }
  };

  return (
    <div className={`sidebar ${sidebarShrunk ? "shrunk" : ""}`}>
      <div className="profile-section" ref={profileIconRef}>
        <ProfileButton onClick={toggleDropdown}>
          {renderProfileIcon()}
        </ProfileButton>
      </div>

      {isDropdownOpen && (
        <div className="user-details-dropdown" ref={dropdownRef}>
          <p>Profile details...</p>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-contact">Add Contact</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
          <li><Link to="/totalcontacts">Total Contacts</Link></li>
          <li><Link to="/importexport">Import/Export</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
        </ul>
      </nav>

      <div className="footer-image-container">
        <img 
          src={require("../images/Sidebar.png")} 
          alt="Image by Freepik" 
          className="footer-image" 
        />
      </div>
    </div>
  );
};

export default Sidebar;
