
import React from "react";

function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <h2>Please login first!</h2>;
    }

    return (
        <div className="student-dashboard">
            <h1>My Profile</h1>

            <div className="event-card">
                <h2>Student Details</h2>

                <p><strong>Student ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
}

export default Profile;
