const mongoose = require('mongoose');
 
const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  locations: [
    {
      name: String, // This will be City + State + Country for display purposes
      latitude: Number,
      longitude: Number,
      fullAddress: String, // Store the entire formatted address
    },
  ],
}, {
  timestamps: true,
});
 
module.exports = mongoose.model('UserLocation', locationSchema);