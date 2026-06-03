const pool = require('../config/db');
const dotenv = require('dotenv');
const { createAuditLog } = require('../utils/auditLogger');

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
        
        const incident = result.rows[0];

        // Log the creation
        await createAuditLog(
            incident.id,
            'created',
            null,
            JSON.stringify({ title, description, severity, status }),
            created_by
        );

        res.status(201).json(incident);
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

const getIncidentById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM incidents WHERE id = $1',
            [id]
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

const updateIncident = async (req, res) => {
    const { id } = req.params;
    const { title, description, severity, status } = req.body;
    const user_id = req.user.id;

    try {
        // Get old values first
        const oldResult = await pool.query(
            'SELECT * FROM incidents WHERE id = $1',
            [id]
        );

        if (oldResult.rows.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        const oldIncident = oldResult.rows[0];

        // Update the incident
        const result = await pool.query(
            'UPDATE incidents SET title = $1, description = $2, severity = $3, status = $4 WHERE id = $5 RETURNING *',
            [title, description, severity, status, id]
        );

        const newIncident = result.rows[0];

        // Log each field change
        if (oldIncident.title !== title) {
            await createAuditLog(id, 'title_changed', oldIncident.title, title, user_id);
        }
        if (oldIncident.description !== description) {
            await createAuditLog(id, 'description_changed', oldIncident.description, description, user_id);
        }
        if (oldIncident.severity !== severity) {
            await createAuditLog(id, 'severity_changed', oldIncident.severity, severity, user_id);
        }
        if (oldIncident.status !== status) {
            await createAuditLog(id, 'status_changed', oldIncident.status, status, user_id);
        }

        res.status(200).json(newIncident);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteIncident = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        // Get incident data before deletion
        const result = await pool.query(
            'SELECT * FROM incidents WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        const incident = result.rows[0];

        // Delete the incident
        await pool.query('DELETE FROM incidents WHERE id = $1', [id]);

        // Log the deletion
        await createAuditLog(
            id,
            'deleted',
            JSON.stringify(incident),
            null,
            user_id
        );

        res.status(200).json({ message: 'Incident deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident
}