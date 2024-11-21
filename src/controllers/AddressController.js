const Location = require('../models/AddressSchema');
// const CustomError = require('../utils/CustomError');
 
// Add a new location for the user
exports.addLocation = async (req, res, next) => {
  try {
    const  userId  = req.body.userId;
    const { name, latitude, longitude, fullAddress } = req.body;
 
    console.log("from backend",userId);
    // Check if the user already has this location saved (with same latitude and longitude)
    const existingLocation = await Location.findOne({
      userId,
      "locations.latitude": latitude,
      "locations.longitude": longitude,
    });
 
    if (existingLocation) {
      // If location already exists, return success without storing it again
      return res.status(200).json({
        message: 'Location already exists, no need to store it again',
      });
    }
 
    // Check if the user already has locations saved
    let location = await Location.findOne({ userId });
 
    if (!location) {
      // Create new location record if none exist
      location = new Location({
        userId,
        locations: [{ name, latitude, longitude, fullAddress }],
      });
    } else {
      // Add new location to the existing user's location array
      location.locations.push({ name, latitude, longitude, fullAddress });
    }
 
    await location.save();
    res.status(201).json({
      status: 'success',
      location,
    });
  } catch (error) {
    next(error);
  }
};
 
// Get all locations for the user
exports.getLocations = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    // Find locations for the logged-in user
    const locationData = await Location.findOne({ userId });
    console.log(locationData);
    if (!locationData || !locationData.locations || locationData.locations.length === 0) {
    console.log('No location data found for this user');
    return res.status(404).json({ message: 'No locations found for this user' });
    }
 
    // Send back the list of locations as an array
    res.status(200).json({
      status: 'success',
      locations: locationData.locations,
    });
  } catch (error) {
    console.error("Error retrieving locations:", error);
    next(error);
  }
};
 