const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const authenticateToken = require('../middlewares/authenticateToken')
// Add item to cart
console.log("sravaniiii")
router.post('/cart', authenticateToken,cartController.addToCart);

// Get user's cartfrom 
router.get('/cart/:userId', cartController.getCart);

// Update cart quantity
router.put('/cart', authenticateToken,cartController.update);

// Remove item from cart
router.delete('/cart/:userId/:productId', authenticateToken,cartController.removeFromCart);

// Route for clearing the entire cart
router.delete('/cart/:userId', cartController.clearCart);

module.exports = router;
