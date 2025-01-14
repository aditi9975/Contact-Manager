import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Sidebar = ({ user }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <div className="sidebar">
      {/* Other Sidebar items */}
      {user && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Sidebar;
