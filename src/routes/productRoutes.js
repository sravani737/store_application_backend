// const express = require('express');
// const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
// const router = express.Router();

// // Create a new product
// router.post('/', createProduct);

// // Get all products
// router.get('/', getProducts);

// // Get a single product by ID
// router.get('/:id', getProductById);

// // Update a product by ID
// router.put('/:id', updateProduct);

// // Delete a product by ID
// router.delete('/:id', deleteProduct);

// module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Ensure the correct path
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const authenticateToken = require('../middlewares/authenticateToken');


// Add Product
router.post('/', authenticateToken,productController.addProduct);


router.get('/top',productController.get);

// Get all products
router.get('/', authenticateToken,productController.getAllProducts);

// Get product by id
router.get('/:id', productController.getProductById);

// Update product by id
router.put('/:id', productController.updateProduct);

// Delete product by id
router.delete('/:id', authenticateToken,productController.deleteProduct);


module.exports = router;
