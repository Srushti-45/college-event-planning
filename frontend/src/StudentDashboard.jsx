
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
  if (!user) {
    alert("Please login first!");
    navigate("/login");
  }
}, [user, navigate]);

if (!user) {
  return null;
}
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/my-registrations/${user.id}`)
        .then(response => response.json())
        .then(data => setEvents(data))
        .catch(error => console.log(error));
    }
  }, []);

  const handleCancel = (eventId) => {
    if (window.confirm("Are you sure you want to cancel this registration?")) {

        fetch(`http://localhost:5000/cancel-registration/${user.id}/${eventId}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);

            if (data.message === "Registration cancelled successfully!") {
                setEvents(prevEvents =>
                    prevEvents.filter(event => event.id !== eventId)
                );
            }
        })
        .catch(error => console.log(error));
    }
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>

      <h2>Welcome, {user ? user.name : "Student"}!</h2>

      <p>Email: {user ? user.email : "Not available"}</p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>My Event Registrations</h2>

      {events.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        events.map(event => (
          <div className="event-card" key={event.id}>
            <h3>{event.event_name}</h3>
            <p>{event.description}</p>
            <p>Date: {event.event_date}</p>
            <p>Time: {event.event_time}</p>
            <p>Venue: {event.venue}</p>
            
            <button onClick={() => handleCancel(event.id)}>
    Cancel Registration
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentDashboard;
