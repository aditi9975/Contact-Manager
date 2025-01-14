import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../../assets/firebase"; // Firebase configuration
import Analytics from "../Dashboard/Analytics"; // Import Analytics component if not already
import "../../Styles/HomeAn.css"; // Import custom styles
import "../../Styles/Style.css";

const Home = () => {
  const [reminders, setReminders] = useState([]); // For birthdays
  const [events, setEvents] = useState([]); // For calendar events
  const [showReminder, setShowReminder] = useState(true); // Track if reminders are shown

  // Fetch birthdays
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const contactsRef = ref(db, `users/${user.uid}/contacts`);
      onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const today = new Date();
          const todayReminders = Object.values(data).filter((contact) => {
            const dob = new Date(contact.dob);
            return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
          });
          setReminders(todayReminders);
        }
      });
    }
  }, []);

  // Fetch events
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const todayStr = new Date().toDateString();
      const eventsRef = ref(db, `users/${user.uid}/events/${todayStr}`);
      onValue(eventsRef, (snapshot) => {
        if (snapshot.exists()) {
          setEvents(snapshot.val());
        } else {
          setEvents([]); // No events for today
        }
      });
    }
  }, []);

  const handleCloseReminder = () => {
    setShowReminder(false); // Hide reminders when closed
  };

  return (
    <div className="contact-home-app">
      {/* Welcome Message */}
      <h2>Welcome to Contact Manager!</h2>
      <p>Manage your contacts easily and keep your connections organized.</p>

      {/* Today's Reminders */}
      <div className="notifications">
        <h3>Today's Reminders</h3>
        {showReminder && (
          <div className="reminder">
            <ul>
              {/* Display birthdays */}
              {reminders.map((contact, index) => (
                <li key={index}>
                  🎉 {contact.name}'s Birthday!
                </li>
              ))}
              {/* Display calendar events */}
              {events.map((event, index) => (
                <li key={event.id}>
                  📅 {event.text}
                </li>
              ))}
            </ul>
            {reminders.length === 0 && events.length === 0 && <p>No reminders for today.</p>}
            <button onClick={handleCloseReminder}>Close Reminder</button>
          </div>
        )}
      </div>

      {/* Analytics (Always show on Home page) */}
      <Analytics />
    </div>
  );
};

export default Home;
