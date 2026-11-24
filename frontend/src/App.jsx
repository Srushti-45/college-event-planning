
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Events from "./Events";
import Register from "./Register";
import Admin from "./Admin";
import StudentDashboard from "./StudentDashboard";
import AdminRegistrations from "./AdminRegistrations";
import Profile from "./Profile";

import "./App.css";

function App() {
  return (
    <div>
      <nav className="navbar">
        <h2>College Events</h2>

        <div className="nav-links">
          <Link to="/admin-registrations">View Registrations</Link>
          <Link to="/">Home</Link>
          <Link to="/events">Upcoming Events</Link>
          <Link to="/register">Register</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/login">Login</Link>
          <Link to="/student-dashboard">Student Dashboard</Link>
        </div>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-registrations" element={<AdminRegistrations />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </div>
  );
}

export default App;
