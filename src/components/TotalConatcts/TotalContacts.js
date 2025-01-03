import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { db } from "../../assets/firebase";
import "../../Styles/TotalContacts.css";
import { FaPencilAlt, FaTrash, FaHeart, FaFilter, FaTimes, FaSearch, FaRegTrashAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth"; // Firebase Authentication

const TotalContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  useEffect(() => {
    if (user) {
      const contactsRef = ref(db, `users/${user.uid}/contacts`);
      onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      });
    }
  }, [user]);

  const handleSearch = () => {
    const result = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    );

    if (result.length > 0) {
      setFilteredContacts(result);
      setShowPopup(true);
    } else {
      alert("No contact found!");
      setFilteredContacts([]);
      setShowPopup(false);
    }
  };

  const handleFilterClick = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    filterContacts(category);
  };

  const filterContacts = (category) => {
    if (category) {
      const result = contacts.filter((contact) => contact.category === category);
      setFilteredContacts(result);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete selected contacts?")) {
      selectedContacts.forEach((id) => {
        remove(ref(db, `users/${user.uid}/contacts/${id}`));
      });
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const handleFavorite = (id, isFavorite) => {
    update(ref(db, `users/${user.uid}/contacts/${id}`), {
      favorite: !isFavorite,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      remove(ref(db, `users/${user.uid}/contacts/${id}`));
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const { name, phone, email, category, dob, notes } = editingContact;
  
    // Create an object with the fields that have values
    const updatedContact = {
      name,
      phone,
      category,
      // Only include email if it's provided
      ...(email && { email }),
      // Only include dob if it's provided
      ...(dob && { dob }),
      // Only include notes if it's provided
      ...(notes && { notes }),
    };
  
    update(ref(db, `users/${user.uid}/contacts/${editingContact.id}`), updatedContact)
      .then(() => {
        setShowEditModal(false);
        setEditingContact(null);
      })
      .catch((error) => {
        console.error("Error updating contact:", error);
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="total-contact-app">
      <h2>Total Contacts</h2>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>

        {showPopup && (
          <div className="search-result-card">
            <div className="search-result-header">
              <h4>Search Results</h4>
              <FaTimes
                className="close-search-popup"
                onClick={() => setShowPopup(false)}
              />
            </div>
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="popup-contact-item">
                <h5>{contact.name}</h5>
                <p>Phone: {contact.phone}</p>
                <p>Category: {contact.category}</p>
              </div>
            ))}
          </div>
        )}

        <div className="filter-container">
          <button onClick={handleFilterClick} className="filter-btn">
            <FaFilter /> Filter
          </button>

          {showCategoryDropdown && (
            <div className="category-dropdown">
              <button onClick={() => handleCategorySelect("Family")}>Family</button>
              <button onClick={() => handleCategorySelect("Friends")}>Friends</button>
              <button onClick={() => handleCategorySelect("Work")}>Work</button>
              <button onClick={() => handleCategorySelect("")}>All Categories</button>
              <FaTimes
                onClick={() => setShowCategoryDropdown(false)}
                className="close-dropdown"
              />
            </div>
          )}
        </div>

        <button
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={selectedContacts.length === 0}
        >
          <FaRegTrashAlt /> Delete Selected
        </button>
      </div>

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

      <div className="contact-list">
        {contacts
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
          .filter((contact) =>
            selectedCategory ? contact.category === selectedCategory : true
          )
          .map((contact) => (
            <div key={contact.id} className="contact-item">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={() => handleSelectContact(contact.id)}
              />
              <div className="contact-details">
                <h4>{contact.name}</h4>
                <p>Phone: {contact.phone}</p>
                <p>Category: {contact.category}</p>
              </div>
              <div className="contact-actions">
                <button
                  onClick={() => handleFavorite(contact.id, contact.favorite)}
                >
                  <FaHeart color={contact.favorite ? "red" : "white"} />
                </button>
                <button onClick={() => handleEdit(contact)}>
                  <FaPencilAlt />
                </button>
                <button onClick={() => handleDelete(contact.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TotalContacts;
