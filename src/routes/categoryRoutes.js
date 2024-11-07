// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); // Adjust the path based on your file structure

// Route to get all categories
router.get('/', categoryController.getCategories);

// Route to add a new category
router.post('/', categoryController.addCategory);

// Route to update a category by category_id
router.put('/categories/:id', categoryController.updateCategory);

// Route to delete a category by category_id
router.delete('/categories/:id', categoryController.deleteCategory);


module.exports = router;
