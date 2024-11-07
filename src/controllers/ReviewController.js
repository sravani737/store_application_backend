// review.controller.js
const Review = require('../models/ReviewSchema');
const Product = require('../models/productSchema');

// Create a new review
const mongoose = require('mongoose');


// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { product_id, rating, review_text, user_id } = req.body;
        console.log(product_id, rating, review_text, user_id);

        // Create a new review
        const review = new Review({
            product_id,
            user_id,
            rating,
            review_text,
        });

        // Save the review to the database
        await review.save();
        console.log('Review saved successfully:', review);

        // Update the product's average rating after saving the review
        const reviews = await Review.find({ product_id:new  mongoose.Types.ObjectId(product_id) });
     
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        
        // Update the product's average rating and add the new review to the reviews array
        await Product.findByIdAndUpdate(product_id, {
            $push: { reviews: review._id }, // Add the new review to the `reviews` array
            rating: averageRating, // Update the product's average rating
        });

        // Respond with success
        console.log('Review saved and product rating updated successfully');
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review', error });
    }
};


// Fetch all reviews for a specific product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product_id: productId }).populate('user_id', 'user_name');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Get average rating for a product
exports.getProductAverageRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const averageRating = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(productId) } },
            { $group: { _id: '$product_id', averageRating: { $avg: '$rating' } } }
        ]);

        res.json(averageRating[0] ? averageRating[0].averageRating : 0);
    } catch (error) {
        res.status(500).json({ message: 'Error calculating average rating', error });
    }
};
