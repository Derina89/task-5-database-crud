const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Test database connection
pool.connect()
    .then(client => {
        console.log("PostgreSQL connected successfully.");
        client.release();
    })
    .catch(error => {
        console.error("PostgreSQL connection failed:", error.message);
    });

// GET all courses
app.get("/api/courses", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM courses ORDER BY id DESC"
        );

        res.json({
            success: true,
            courses: result.rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch courses."
        });
    }
});

// GET one course
app.get("/api/courses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID."
            });
        }

        const result = await pool.query(
            "SELECT * FROM courses WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        res.json({
            success: true,
            course: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch course."
        });
    }
});

// ADD course
app.post("/api/courses", async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Title must contain at least 3 characters."
            });
        }

        if (description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must contain at least 10 characters."
            });
        }

        const result = await pool.query(
            `INSERT INTO courses (title, category, description)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                title.trim(),
                category.trim(),
                description.trim()
            ]
        );

        res.status(201).json({
            success: true,
            message: "Course added successfully.",
            course: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to add course."
        });
    }
});

// UPDATE course
app.put("/api/courses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, category, description } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID."
            });
        }

        if (!title || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Title must contain at least 3 characters."
            });
        }

        if (description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must contain at least 10 characters."
            });
        }

        const result = await pool.query(
            `UPDATE courses
             SET title = $1,
                 category = $2,
                 description = $3
             WHERE id = $4
             RETURNING *`,
            [
                title.trim(),
                category.trim(),
                description.trim(),
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        res.json({
            success: true,
            message: "Course updated successfully.",
            course: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update course."
        });
    }
});

// DELETE course
app.delete("/api/courses/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID."
            });
        }

        const result = await pool.query(
            "DELETE FROM courses WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        res.json({
            success: true,
            message: "Course deleted successfully.",
            course: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete course."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});