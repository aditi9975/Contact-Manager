import React, { useState, useEffect } from "react";
import { db } from "../../assets/firebase"; // Assuming firebase.js is correctly set up
import { ref, get, set, push } from "firebase/database";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import "../../Styles/ImportExport.css"; // Add the styles for the page

const ImportExport = () => {
  const [contacts, setContacts] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  // Fetch contacts from Firebase when the component mounts
  useEffect(() => {
    if (user) {
      const fetchContacts = async () => {
        const contactsRef = ref(db, `users/${user.uid}/contacts`);
        const snapshot = await get(contactsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const contactsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setContacts(contactsArray);
        }
      };
      fetchContacts();
    }
  }, [user]);

  // Export contacts to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Category", "DOB", "Notes"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    contacts.forEach(contact => {
      const row = [
        contact.name,
        contact.phone,
        contact.category,
        contact.dob,
        contact.notes
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setImportFile(file);
      setErrorMessage(""); // Clear any previous error
    } else {
      setImportFile(null);
      setErrorMessage("Please select a valid CSV file.");
    }
  };

  // Analyze and import CSV data with duplicate handling
  const importFromCSV = async () => {
    if (importFile && user) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));
        const header = rows[0].map((col) => col.trim().toLowerCase()); // Get header row and normalize column names
        const contactData = rows.slice(1).map((row) => {
          const contact = {};
          row.forEach((value, index) => {
            const column = header[index];
            if (column.includes("name")) {
              contact.name = value.trim();
            } else if (column.includes("phone")) {
              contact.phone = value.trim();
            } else if (column.includes("category")) {
              contact.category = value.trim();
            } else if (column.includes("dob")) {
              contact.dob = value.trim();
            } else if (column.includes("notes")) {
              contact.notes = value.trim();
            }
          });
          return contact;
        });

        // Get existing contacts from Firebase to avoid duplicates
        const contactsRef = ref(db, `users/${user.uid}/contacts`);
        const snapshot = await get(contactsRef);
        const existingContacts = snapshot.exists() ? snapshot.val() : {};

        const validContacts = contactData.filter((contact) => {
          if (!contact.name || !contact.phone) return false; // Skip incomplete contacts
          const existingContact = Object.values(existingContacts).find(
            (existing) => existing.phone === contact.phone
          );
          return !existingContact; // Skip if duplicate is found
        });

        // Push valid contacts to Firebase
        validContacts.forEach(async (contact) => {
          const newContactRef = push(contactsRef);
          await set(newContactRef, contact);
        });

        alert(`${validContacts.length} contacts imported successfully! Invalid or duplicate entries were ignored.`);
        setLoading(false);
      };
      reader.readAsText(importFile);
    }
  };

  return (
    <div className="import-export-app">
      <h2>Import/Export Contacts</h2>
      <p>
        You can <strong>export your contacts as a CSV file</strong> or <strong>import contacts from a CSV file</strong>.
      </p>

      <div className="action-buttons">
        <button className="export-btn" onClick={exportToCSV}>
          Export Contacts
        </button>
        <div className="import-section">
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            onChange={handleFileChange}
            className="import-file-input"
            disabled={loading}
          />
          <label htmlFor="fileInput" className="import-file-label">
            Choose File
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button
            className="import-btn"
            onClick={importFromCSV}
            disabled={!importFile || loading}
          >
            {loading ? "Importing..." : "Import Contacts"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
