const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const authenticateToken = require('../middlewares/authenticateToken')
// Create a new order
router.post('/orders', orderController.createOrder);

router.get('/orders',authenticateToken,orderController.getAllOrders)

// Fetch Order for Specific user 
router.get('/orders/:userId',orderController.getUserOrders);

module.exports = router;
