const express = require('express');
const { addLocation, getLocations } = require('../controllers/AddressController');

 
const router = express.Router();
 
// Add new location
router.post('/add', addLocation);
 
// Get all locations
router.get('/locations', getLocations);
 
module.exports = router;