import React, { useState, useEffect } from 'react';
import { auth } from "../assets/firebase"; // Assuming Firebase authentication
import { signOut } from "firebase/auth";

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data
  const [userColor, setUserColor] = useState(null); // State to hold the user's fixed color

  // Fetch user data when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Check if we have a stored color for the user
        const storedColor = localStorage.getItem(`userColor-${user.uid}`);
        if (!storedColor) {
          const newColor = getRandomColor(); // Generate a new color if not found
          localStorage.setItem(`userColor-${user.uid}`, newColor); // Store color in localStorage
          setUserColor(newColor);
        } else {
          setUserColor(storedColor); // Use the stored color if found
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
   // Extract the first part of the email (before @) for the welcome message
   const getUserEmailPrefix = (email) => {
    return email.split('@')[0]; // Get the part before the @ symbol
  };

  // Function to generate a random background color
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  // Render the profile icon with the user's first letter of email and the fixed background color
  const renderProfileIcon = () => {
    if (user) {
      const firstLetter = user.email ? user.email.charAt(0).toUpperCase() : "U"; // First letter of email or default "U"
      const profileImage = user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image" 
          style={{ backgroundColor: userColor }} // Apply color to the image container
        />
      ) : (
        <div 
          className="profile-image" 
          style={{ backgroundColor: userColor }}
        >
          {firstLetter}
        </div>
      );
      
      return profileImage;
    } else {
      return (
        <div
          className="profile-image"
          style={{ backgroundColor: getRandomColor() }}
        >
          👤
        </div>
      );
    }
  };

  return (
    <div className="profile-section">
      <button className={`profile-icon ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}>
        {renderProfileIcon()}
      </button>

      {isOpen && user && (
        <div className="user-details-dropdown">
        <p>Welcome, {user.displayName || getUserEmailPrefix(user.email) || 'User'}</p> {/* Show name or email prefix */}
        <p>Email: {getUserEmailPrefix(user.email)}</p> {/* Show only the part before @ */}
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      )}
    </div>
  );
};

export default ProfileButton;
