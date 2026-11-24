
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to College Event Management System</h1>

      <p>
        Discover college events, participate in activities
        and make your college life memorable!
      </p>

      <div className="home-buttons">
        <Link to="/events">
          <button>Explore Events</button>
        </Link>

        <Link to="/register">
          <button>Student Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
