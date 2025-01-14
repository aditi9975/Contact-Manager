import React, { useState, useEffect } from "react";
import Addcontact from './Addcontact'; // Import the AddContact component
import { db } from "../../assets/firebase"; // Firebase configuration
import { ref, get } from "firebase/database"; // Firebase methods
import "../../Styles/AddApp.css";
import { auth } from "../../assets/firebase"; // Import auth to get UID

const AddApp = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user-specific contacts from Firebase
  useEffect(() => {
    const user = auth.currentUser; // Get current logged-in user
    if (user) {
      const contactsRef = ref(db, `users/${user.uid}/contacts`); // Reference to user's contacts
      get(contactsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const contactsData = snapshot.val();
            const contactsArray = Object.keys(contactsData).map((key) => ({
              id: key,
              ...contactsData[key],
            }));

            contactsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setContacts(contactsArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching contacts: ", error);
          setError("Failed to load contacts. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("User not authenticated.");
    }
  }, []);

  return (
    <div className="addapp-container">
      <Addcontact setContacts={setContacts} />

      <div className="recent-contacts-list">
        <h2>Recent Contacts</h2>

        {loading && <p className="loading">Loading contacts...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && contacts.length === 0 && <p>No contacts available.</p>}

        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-details">
              <h3>{contact.name}</h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <p>Category: {contact.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddApp;
