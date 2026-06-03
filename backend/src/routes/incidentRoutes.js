const {getIncidents, updateIncident, createIncident, deleteIncident, getIncidentById} = require('../controllers/incidentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');

const router = express.Router();

// All incident routes require authentication
router.post('/', authenticateToken, createIncident);
router.get('/', authenticateToken, getIncidents);
router.get('/:id', authenticateToken, getIncidentById);
router.put('/:id', authenticateToken, updateIncident);
router.delete('/:id', authenticateToken, deleteIncident);

module.exports = router;
