
import React, { useEffect, useState } from "react";
import "./App.css";
import Register from "./Register";

function Admin() {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [eventCounts, setEventCounts] = useState([]);

  const [form, setForm] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_time: "",
    venue: ""
  });

  const loadEvents = () => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetch("http://localhost:5000/event-registration-count")
    .then(response => response.json())
    .then(data => setEventCounts(data))
    .catch(error => console.log(error));
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Event
  const addEvent = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    alert(result.message || result.error);

    resetForm();
    loadEvents();
  };

  // Reset Form
  const resetForm = () => {
    setEditId(null);
    setForm({
      event_name: "",
      description: "",
      event_date: "",
      event_time: "",
      venue: ""
    });
  };

  // Edit Event
 const editEvent = (event) => {
  console.log("Editing event:", event);

  setEditId(event.id);

  setForm({
    event_name: event.event_name,
    description: event.description,
    event_date: new Date(event.event_date).toISOString().split("T")[0],
    event_time: event.event_time,
    venue: event.venue
  });
};

  // Update Event
  const updateEvent = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://localhost:5000/events/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      alert("Update failed: " + JSON.stringify(result));
      return;
    }

    alert("Event updated successfully!");

    resetForm();
    loadEvents();

  } catch (error) {
    console.log("Update error:", error);
    alert("Something went wrong while updating!");
  }
};
const [totalEvents, setTotalEvents] = useState(0);
const [totalRegistrations, setTotalRegistrations] = useState(0);
const [totalStudents, setTotalStudents] = useState(0);

useEffect(() => {
  fetch("http://localhost:5000/events")
    .then(response => response.json())
    .then(data => setTotalEvents(data.length));

    fetch("http://localhost:5000/total-students")
  .then(response => response.json())
  .then(data => setTotalStudents(data.total));

  fetch("http://localhost:5000/all-registrations")
    .then(response => response.json())
    .then(data => setTotalRegistrations(data.length));
}, []);
  return (
    <div>
        <div className="admin-stats">
            <div className="event-count-section">
    <h2>Event-wise Registration Count</h2>

    {eventCounts.map((event, index) => (
        <div className="event-count-card" key={index}>
            <h3>{event.event_name}</h3>
            <p>
                Total Registrations: {event.total_registrations}
            </p>
        </div>
    ))}
</div>

  <div className="stat-card">
    <h3>Total Events</h3>
    <h1>{totalEvents}</h1>
  </div>

  <div className="stat-card">
    <h3>Total Registrations</h3>
    <h1>{totalRegistrations}</h1>
  </div>

</div>
<div className="stat-card">
  <h3>Total Students</h3>
  <h1>{totalStudents}</h1>
</div>
      
      <h1>College Event Management System</h1>

      <h2>{editId ? "Edit Event" : "Add New Event"}</h2>

      <form onSubmit={editId ? updateEvent : addEvent}>
        <input
          name="event_name"
          placeholder="Event Name"
          value={form.event_name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="event_time"
          value={form.event_time}
          onChange={handleChange}
          required
        />

        <input
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Event" : "Add Event"}
        </button>

        {editId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(event => (
          <div className="event-card" key={event.id}>
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.event_date).toLocaleDateString("en-IN")}</p>
            <p>Time: {event.event_time}</p>
            <p>Venue: {event.venue}</p>

            <button type="button" onClick={() => editEvent(event)}>
              Edit
            </button>

            <button type="button" onClick={async () => {
              const response = await fetch(
                `http://localhost:5000/events/${event.id}`,
                { method: "DELETE" }
              );

              const result = await response.json();
              alert(result.message);
              loadEvents();
            }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;
