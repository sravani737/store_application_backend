// review.routes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const authenticateToken = require('../middlewares/authenticateToken');

// Route to add a new review
router.post('/reviews', reviewController.createReview);

// Route to get all reviews for a product
router.get('reviews/product/:productId', reviewController.getProductReviews);


module.exports = router;
