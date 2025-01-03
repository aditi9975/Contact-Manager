import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Default Calendar styles
import "../../Styles/Calendar.css";         // Custom styles
import { ref, set, get } from "firebase/database";
import { db, auth } from "../../assets/firebase"; // Import Firebase

const DynamicCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");

  const onChange = (newDate) => {
    setDate(newDate);
    fetchEvents(newDate);
  };

  const fetchEvents = async (date) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const dateStr = date.toDateString();
    const eventsRef = ref(db, `users/${user.uid}/events/${dateStr}`); // Store events by UID
    try {
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (date, eventDetails) => {
    const user = auth.currentUser;
    if (!user) return;

    const eventsRef = ref(db, `users/${user.uid}/events/${date.toDateString()}`);
    try {
      const snapshot = await get(eventsRef);
      const existingEvents = snapshot.exists() ? snapshot.val() : [];
      const newEventObj = {
        id: Date.now(),
        text: eventDetails,
      };
      existingEvents.push(newEventObj);
      await set(eventsRef, existingEvents);
      fetchEvents(date);
      setNewEvent("");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  return (
    <div className="dynamic-calendar-wrapper">
      <Calendar onChange={onChange} value={date} className="calendar-main" />
      <div className="event-details">
        <h3>Events for {date.toDateString()}</h3>
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.text}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add a new event"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
        />
        <button onClick={() => addEvent(date, newEvent)}>Add Event</button>
      </div>
    </div>
  );
};

export default DynamicCalendar;
