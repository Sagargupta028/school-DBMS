const express = require('express');
const router = express.Router();
const db = require('../db');

// (A) Add School API
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const conn = await db.promise();
        const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        const [result] = await conn.query(sql, [name, address, latitude, longitude]);
        res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (B) Add Multiple Schools API
router.post('/addSchools', async (req, res) => {
    const schools = req.body;

    if (!Array.isArray(schools) || schools.length === 0) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    try {
        const conn = await db.promise();
        const values = schools.map(s => [s.name, s.address, s.latitude, s.longitude]);
        const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES ?";
        const [result] = await conn.query(sql, [values]);
        res.json({ message: "Schools added successfully", inserted: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (C) Get School by ID API
router.get('/getSchool/:id', async (req, res) => {
    const schoolId = req.params.id;

    try {
        const conn = await db.promise();
        const [results] = await conn.query("SELECT * FROM schools WHERE id = ?", [schoolId]);

        if (results.length === 0) {
            return res.status(404).json({ error: "School not found" });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (D) Function to calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const conn = await db.promise();
        const [results] = await conn.query("SELECT * FROM schools");

        const sortedSchools = results.map(school => ({
            ...school,
            distance: getDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
