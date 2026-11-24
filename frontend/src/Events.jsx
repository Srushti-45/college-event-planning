import React, { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState([]);

  // ================= LOAD EVENTS =================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        setEvents(data);
        setError("");
      } catch (error) {
        console.error("Events loading error:", error);
        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Load registered events for logged-in student
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        fetch(`http://localhost:5000/my-registrations/${user.id}`)
          .then(response => response.json())
          .then(data => {
            setRegisteredEvents(data.map(event => event.id));
          })
          .catch(error => {
            console.error("Registration loading error:", error);
          });
      }
    } catch (error) {
      console.error("User data error:", error);
    }
  }, []);

  // ================= REGISTER FOR EVENT =================

  const handleRegister = async (eventId) => {
    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      user = null;
    }

    if (!user) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    if (registeredEvents.includes(eventId)) {
      alert("You are already registered for this event!");
      return;
    }

    setRegistering(prev => [...prev, eventId]);

    try {
      const response = await fetch(
        "http://localhost:5000/register-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user.id,
            event_id: eventId
          })
        }
      );

      const result = await response.json();

      alert(result.message);

      if (response.ok) {
        setRegisteredEvents(prev => [...new Set([...prev, eventId])]);
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistering(prev => prev.filter(id => id !== eventId));
    }
  };

  // ================= DATE FORMAT =================

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // ================= PAGE =================

  return (
    <div className="events-page">

      <h1>Upcoming Events</h1>

      {loading && (
        <p>Loading events...</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && events.length === 0 && (
        <p>No events available.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-container">

          {events.map(event => (
            <div className="event-card" key={event.id}>

              <h2>{event.event_name}</h2>

              <p>{event.description}</p>

              <p>
                <strong>Date:</strong> {formatDate(event.event_date)}
              </p>

              <p>
                <strong>Time:</strong> {event.event_time}
              </p>

              <p>
                <strong>Venue:</strong> {event.venue}
              </p>

              <button
                onClick={() => handleRegister(event.id)}
                disabled={
                  registeredEvents.includes(event.id) ||
                  registering.includes(event.id)
                }
              >
                {registering.includes(event.id)
                  ? "Registering..."
                  : registeredEvents.includes(event.id)
                  ? "Already Registered"
                  : "Register Now"}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Events;