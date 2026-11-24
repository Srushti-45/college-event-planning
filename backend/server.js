const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// ================= HOME =================

app.get("/", (req, res) => {
    res.send("College Event Management System Running!");
});

// ================= DEBUG VERSION =================

app.get("/debug-version", (req, res) => {
    res.send("UPDATED SERVER IS RUNNING");
});

// ================= TEST ROUTE =================

app.get("/test-route", (req, res) => {
    res.send("Test route is working!");
});

// ================= DATABASE TEST =================

app.get("/db-test", (req, res) => {
    db.query("SELECT DATABASE() AS database_name", (err, result) => {
        if (err) {
            console.log("DB TEST ERROR:", err);

            return res.status(500).json({
                message: "Database test failed",
                error: err.message,
                code: err.code
            });
        }

        res.json(result);
    });
});

// ================= TEST EVENTS TABLE =================

app.get("/test-events", (req, res) => {
    db.query("SELECT * FROM events", (err, result) => {
        if (err) {
            console.log("TEST EVENTS ERROR:", err);

            return res.status(500).json({
                message: "Events query failed",
                error: err.message,
                code: err.code
            });
        }

        res.json({
            message: "Events query successful",
            data: result
        });
    });
});

// ================= STUDENT REGISTRATION =================

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, 'student')
        `;

        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.log("REGISTER ERROR:", err.message);

                return res.status(500).json({
                    message: "Registration failed",
                    error: err.message
                });
            }

            res.json({
                message: "Student registered successfully!"
            });
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error.message);

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// ================= STUDENT LOGIN =================

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                console.log("LOGIN ERROR:", err.message);

                return res.status(500).json({
                    message: "Login failed",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Student not found"
                });
            }

            const user = result[0];

            try {
                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return res.status(401).json({
                        message: "Incorrect password"
                    });
                }

                res.json({
                    message: "Login successful!",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });

            } catch (error) {
                res.status(500).json({
                    message: "Login error",
                    error: error.message
                });
            }
        }
    );
});

// ================= GET ALL EVENTS =================

app.get("/events", (req, res) => {
    console.log("GET /events REQUEST RECEIVED");

    db.query("SELECT * FROM events", (err, result) => {
        if (err) {
            console.log("EVENTS ERROR:", err);

            return res.status(500).json({
                message: "Failed to fetch events",
                error: err.message,
                code: err.code
            });
        }

        console.log("EVENTS RESULT:", result);

        res.json(result);
    });
});

// ================= ADD EVENT =================

app.post("/events", (req, res) => {
    const {
        event_name,
        description,
        event_date,
        event_time,
        venue
    } = req.body;

    if (!event_name) {
        return res.status(400).json({
            message: "Event name is required"
        });
    }

    const sql = `
        INSERT INTO events
        (event_name, description, event_date, event_time, venue)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [event_name, description, event_date, event_time, venue],
        (err, result) => {
            if (err) {
                console.log("ADD EVENT ERROR:", err.message);

                return res.status(500).json({
                    message: "Event addition failed",
                    error: err.message
                });
            }

            res.json({
                message: "Event added successfully!",
                eventId: result.insertId
            });
        }
    );
});

// ================= DELETE EVENT =================

app.delete("/events/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM events WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.log("DELETE EVENT ERROR:", err.message);

                return res.status(500).json({
                    message: "Event deletion failed",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            res.json({
                message: "Event deleted successfully!"
            });
        }
    );
});

// ================= UPDATE EVENT =================

app.put("/events/:id", (req, res) => {
    const id = req.params.id;

    const {
        event_name,
        description,
        event_date,
        event_time,
        venue
    } = req.body;

    const sql = `
        UPDATE events
        SET event_name = ?,
            description = ?,
            event_date = ?,
            event_time = ?,
            venue = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [event_name, description, event_date, event_time, venue, id],
        (err, result) => {
            if (err) {
                console.log("UPDATE EVENT ERROR:", err.message);

                return res.status(500).json({
                    message: "Event update failed",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            res.json({
                message: "Event updated successfully!"
            });
        }
    );
});

// ================= MY REGISTRATIONS =================

app.get("/my-registrations/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT events.*
        FROM registrations
        JOIN events
        ON registrations.event_id = events.id
        WHERE registrations.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log("MY REGISTRATIONS ERROR:", err.message);

            return res.status(500).json({
                message: "Unable to fetch registrations",
                error: err.message
            });
        }

        res.json(result);
    });
});

// ================= CANCEL REGISTRATION =================

app.delete("/cancel-registration/:userId/:eventId", (req, res) => {
    const { userId, eventId } = req.params;

    const sql = `
        DELETE FROM registrations
        WHERE user_id = ? AND event_id = ?
    `;

    db.query(sql, [userId, eventId], (err, result) => {
        if (err) {
            console.log("CANCEL REGISTRATION ERROR:", err.message);

            return res.status(500).json({
                message: "Cancellation failed",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        res.json({
            message: "Registration cancelled successfully!"
        });
    });
});

// ================= REGISTER FOR EVENT =================

app.post("/register-event", (req, res) => {
    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({
            message: "User ID and Event ID are required"
        });
    }

    const sql = `
        INSERT INTO registrations (user_id, event_id)
        VALUES (?, ?)
    `;

    db.query(sql, [user_id, event_id], (err, result) => {
        if (err) {
            console.log("REGISTER EVENT ERROR:", err.message);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    message: "Already registered for this event"
                });
            }

            return res.status(500).json({
                message: "Event registration failed",
                error: err.message
            });
        }

        res.json({
            message: "Successfully registered for the event!"
        });
    });
});

// ================= ALL REGISTRATIONS =================

app.get("/all-registrations", (req, res) => {
    const sql = `
        SELECT
            registrations.id,
            users.name AS student_name,
            users.email,
            events.event_name,
            events.event_date
        FROM registrations
        JOIN users
        ON registrations.user_id = users.id
        JOIN events
        ON registrations.event_id = events.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("ALL REGISTRATIONS ERROR:", err.message);

            return res.status(500).json({
                message: "Unable to fetch registrations",
                error: err.message
            });
        }

        res.json(result);
    });
});

// ================= TOTAL STUDENTS =================

app.get("/total-students", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'student'
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("TOTAL STUDENTS ERROR:", err.message);

            return res.status(500).json({
                message: "Unable to fetch students",
                error: err.message
            });
        }

        res.json(result[0]);
    });
});

// ================= EVENT REGISTRATION COUNT =================

app.get("/event-registration-count", (req, res) => {
    const sql = `
        SELECT
            events.event_name,
            COUNT(registrations.id) AS total_registrations
        FROM events
        LEFT JOIN registrations
        ON events.id = registrations.event_id
        GROUP BY events.id, events.event_name
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log("REGISTRATION COUNT ERROR:", err.message);

            return res.status(500).json({
                message: "Unable to fetch registration count",
                error: err.message
            });
        }

        res.json(result);
    });
});

// ================= START SERVER =================

app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});