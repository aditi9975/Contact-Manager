import React, { useState, useEffect } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { db, auth } from "../../assets/firebase"; // Import auth for getting user UID
import "../../Styles/Favorites.css";
import { FaTrash, FaHeart, FaPencilAlt } from "react-icons/fa";

const Favorites = () => {
  const [contacts, setContacts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // Modal state
  const [editingContact, setEditingContact] = useState(null); // Contact being edited

  // Fetch favorite contacts from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const contactsRef = ref(db, `users/${user.uid}/contacts`);
      onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((contact) => contact.favorite); // Only keep favorite contacts
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      });
    }
  }, []);

  // Toggle favorite status
  const handleFavoriteToggle = (id, currentFavoriteStatus) => {
    const user = auth.currentUser;
    if (user) {
      update(ref(db, `users/${user.uid}/contacts/${id}`), {
        favorite: !currentFavoriteStatus, // Toggle the favorite status
      });
    }
  };

  const handleDelete = (id) => {
    const user = auth.currentUser;
    if (user && window.confirm("Are you sure you want to delete this contact?")) {
      remove(ref(db, `users/${user.uid}/contacts/${id}`));
    }
  };

  // Open the edit modal with the contact's data
  const handleEdit = (contact) => {
    setEditingContact(contact); // Set the contact to be edited
    setShowEditModal(true); // Show the edit modal
  };

  // Handle input change in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to save edited contact
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const { name, phone, email, category, dob, notes } = editingContact;
    const user = auth.currentUser;
    if (user) {
      // Update contact in the database
      update(ref(db, `users/${user.uid}/contacts/${editingContact.id}`), {
        name,
        phone,
        email,
        category,
        dob,
        notes,
      });

      // Close modal and reset editing state
      setShowEditModal(false);
      setEditingContact(null);
    }
  };

  return (
    <div className="favorites">
      <h2>Favorite Contacts</h2>

      <div className="contact-list">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>Phone: {contact.phone}</p>
                <p>Email: {contact.email || "N/A"}</p>
                <p>Category: {contact.category}</p>
              </div>
              <div className="actions">
                <button
                  className="favorite-btn"
                  onClick={() => handleFavoriteToggle(contact.id, contact.favorite)}
                >
                  <FaHeart color={contact.favorite ? "red" : "gray"} />
                </button>
                <button className="edit-btn" onClick={() => handleEdit(contact)}>
                  <FaPencilAlt />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(contact.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No favorite contacts found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="edit-contact-modal-overlay">
          <div className="edit-contact-modal">
            <h3>Edit Contact</h3>
            <form onSubmit={handleSaveEdit}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editingContact.name}
                onChange={handleInputChange}
                required
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={editingContact.phone}
                onChange={handleInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingContact.email || ""}
                onChange={handleInputChange}
              />
              <label>Category:</label>
              <select
                name="category"
                value={editingContact.category}
                onChange={handleInputChange}
                required
              >
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={editingContact.dob || ""}
                onChange={handleInputChange}
              />
              <label>Notes:</label>
              <textarea
                name="notes"
                value={editingContact.notes || ""}
                onChange={handleInputChange}
              />
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
