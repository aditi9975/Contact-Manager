import React, { useState } from "react";
import { db, auth } from "../../assets/firebase"; // Import Firebase
import { ref, set } from "firebase/database"; // Firebase methods
import "../../Styles/AddApp.css";

const AddContact = ({ setContacts }) => {
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Friends", // Default category
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add contact to Firebase
  const addContactSubmitHandler = async (e) => {
    e.preventDefault();

    const user = auth.currentUser; // Get current logged-in user
    if (!user) {
      alert("You must be logged in to add a contact.");
      return;
    }

    const userId = user.uid;

    // Validate form data
    if (!contactDetails.name || !contactDetails.phone) {
      alert("Please fill in all required fields (Name and Phone).");
      return;
    }

    setIsLoading(true);

    // Save contact under user’s UID in Firebase
    const newContactRef = ref(db, `users/${userId}/contacts/${new Date().getTime()}`);
    set(newContactRef, {
      ...contactDetails,
      createdAt: new Date().toString(),
    })
      .then(() => {
        setContacts((prevContacts) => [
          { ...contactDetails, id: newContactRef.key },
          ...prevContacts,
        ]);

        setSuccessMessage("Contact added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setContactDetails({ name: "", email: "", phone: "", category: "Friends" });
      })
      .catch((error) => {
        console.error("Error adding contact: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="addapp-container">
      <div className="addapp-content">
        <h2>Add Contact</h2>
        <form onSubmit={addContactSubmitHandler} className="add-contact-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={contactDetails.name}
            onChange={handleInputChange}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            value={contactDetails.email}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={contactDetails.phone}
            onChange={handleInputChange}
            maxLength={10}
            className="input-field"
            required
          />
          <select
            name="category"
            value={contactDetails.category}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
            <option value="Work">Work</option>
          </select>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Contact"}
          </button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default AddContact;
