
import React, { useEffect, useState } from "react";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  useEffect(() => {
    fetch("http://localhost:5000/all-registrations")
      .then(response => response.json())
      .then(data => setRegistrations(data))
      .catch(error => console.log(error));
  }, []);
const handleDownloadCSV = () => {
    const headers = [
        "ID",
        "Student Name",
        "Email",
        "Event Name",
        "Event Date"
    ];

    const rows = registrations.map(item => [
        item.id,
        item.student_name,
        item.email,
        item.event_name,
        item.event_date
    ]);

    const csvContent = [
        headers,
        ...rows
    ].map(row =>
        row.map(value =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Student_Registrations.csv";
    link.click();

    URL.revokeObjectURL(link.href);
};
  return (
    <div className="admin-registrations">
      <h1>Student Event Registrations</h1>
      <button onClick={handleDownloadCSV}>
    Download Registrations
</button>
      <input
  type="text"

  
  placeholder="Search by student name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
<select
  value={eventFilter}
  onChange={(e) => setEventFilter(e.target.value)}
>
  <option value="All">All Events</option>

  {[...new Set(registrations.map(item => item.event_name))].map(name => (
    <option key={name} value={name}>
      {name}
    </option>
  ))}
</select>

      {registrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Event Name</th>
              <th>Event Date</th>
            </tr>
          </thead>

          <tbody>
                {registrations
    .filter(item =>
  (
    item.student_name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  ) &&
  (eventFilter === "All" || item.event_name === eventFilter)
)
  .map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.student_name}</td>
                <td>{item.email}</td>
                <td>{item.event_name}</td>
                <td>{new Date(item.event_date).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminRegistrations;
