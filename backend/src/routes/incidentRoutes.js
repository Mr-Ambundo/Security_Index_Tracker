const {getIncidents, updateIncident, createIncident} = require('../controllers/incidentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');

const router = express.Router();

// All incident routes require authentication
router.post('/', authenticateToken, createIncident);
router.get('/', authenticateToken, getIncidents);
router.put('/:id', authenticateToken, updateIncident);

module.exports = router;
