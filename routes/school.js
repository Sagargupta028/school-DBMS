const express = require('express');
const router = express.Router();
const db = require('../db');

// (A) Add School API
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
    });
});

router.post('/addSchools', (req, res) => {
    const schools = req.body;

    if (!Array.isArray(schools) || schools.length === 0) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    const values = schools.map(s => [s.name, s.address, s.latitude, s.longitude]);

    const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES ?";
    
    db.query(sql, [values], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Schools added successfully", inserted: result.affectedRows });
    });
});

// GET API to fetch a single school by ID
router.get('/getSchool/:id', (req, res) => {
    const schoolId = req.params.id;

    db.query("SELECT * FROM schools WHERE id = ?", [schoolId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: "School not found" });
        }

        res.json(results[0]);
    });
});

// Function to calculate distance using Haversine formula
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

// (B) List Schools API
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const sql = "SELECT * FROM schools";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const sortedSchools = results.map(school => ({
            ...school,
            distance: getDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
});

module.exports = router;
