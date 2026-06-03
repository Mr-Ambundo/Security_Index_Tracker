const {registerUser,loginUser} = require('../controllers/userController');
const express = require('express');
const router = express.Router();

// Define user-related routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;