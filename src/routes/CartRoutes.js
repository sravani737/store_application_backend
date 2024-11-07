const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

// Add item to cart
console.log("sravaniiii")
router.post('/cart', cartController.addToCart);

// Get user's cartfrom cart page frontend []
router.get('/cart/:userId', cartController.getCart);

// Update cart quantity
router.put('/cart', cartController.update);

// Remove item from cart
router.delete('/cart/:userId/:productId', cartController.removeFromCart);

// Route for clearing the entire cart
router.delete('/cart/:userId', cartController.clearCart);

module.exports = router;
