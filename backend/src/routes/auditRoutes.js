const { getIncidentAuditLogs } = require('../controllers/auditController');
const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');

const router = express.Router();

// Get audit logs for an incident
router.get('/incidents/:incident_id/logs', authenticateToken, getIncidentAuditLogs);

module.exports = router;
