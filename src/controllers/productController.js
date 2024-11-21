
const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');

// Add a new product
exports.addProduct = async (req, res) => {
  try {
      const newProduct = new Product(req.body);
      console.log(newProduct);
      console.log("before saving the product");
      await newProduct.save();
      console.log("Product saved successfully!");
      res.status(201).json(newProduct);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
      const { name, minPrice, maxPrice } = req.query; // Get query params from request
      let filter = {};

      // Add name filter if provided, otherwise ignore
      if (name) {
          filter.product_name = { $regex: name, $options: 'i' }; // Case-insensitive match
      }

      // Add price filters if provided, otherwise ignore
      if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) filter.price.$gte = Number(minPrice); // Greater than or equal to minPrice
          if (maxPrice) filter.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
      }

      // If no filter is applied, it will fetch all products
      const products = await Product.find(filter); // Will use filters if provided, otherwise fetches all
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id).populate({
        path: 'reviews',        // Populate the reviews field
        populate: {
          path: 'user_id',      // Assuming each review has a user_id that references the User model
          select: 'user_name'   // Select only the user_name field (or whatever field you want)
        }
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);  // Return the product with populated reviews
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { additionalStock } = req.body;

    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add the additional stock to the current stock
    product.stock += parseInt(additionalStock);

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(deletedProduct);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }s
};


exports.get = async (req, res) => {
    try {
        console.log("from get topProducts:");
      // Fetch top 5 products based on your criteria (e.g., rating, sales)
      const topProducts = await Product.find().sort({ rating: -1 }).limit(5); // Change 'rating' to your criteria
      console.log("successfully fetched topProducts!");
      res.status(200).json(topProducts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch top products' });
    }
};