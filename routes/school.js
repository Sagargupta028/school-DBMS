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
