const pool = require('../config/db');
const dotenv = require('dotenv');

const createIncident = async (req, res) => {
    const { title, description, severity, status } = req.body;
    const created_by = req.user.id; // Get from authenticated user

    // Validate status
    if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'pending' or 'completed'" });
    }

    // Validate severity
    if (!['low', 'high', 'critical'].includes(severity)) {
        return res.status(400).json({ error: "Severity must be 'low', 'high', or 'critical'" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO incidents (title, description, severity, status, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, severity, status, created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

const getIncidents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM incidents');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateIncident = async (req, res) => {
    const { id } = req.params;
    const { title, description, severity, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE incidents SET title = $1, description = $2, severity = $3, status = $4 WHERE id = $5 RETURNING *',
            [title, description, severity, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createIncident,
    getIncidents,
    updateIncident
}