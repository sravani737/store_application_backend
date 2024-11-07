const express = require('express');
const { createRole, getRoles } = require('../controllers/roleController');
const router = express.Router();

// Create a new role
router.post('/', createRole);

// Get all roles
router.get('/', getRoles);

module.exports = router;
