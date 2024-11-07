// // controllers/categoryController.js
// const Category = require('../models/CategorySchema'); // Adjust the path based on your file structure
// const { v4: uuidv4 } = require('uuid');

// // Get all categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching categories', error });
//   }
// };

// // Add a new category
// exports.addCategory = async (req, res) => {
//   const { category_name } = req.body;
//   if (!category_name) {
//     return res.status(400).json({ message: 'Category name is required' });
//   }

//   try {
//     const newCategory = new Category({
//       category_id: uuidv4(), // Generates a unique UUID for the category_id
//       category_name
//     });
//     await newCategory.save();
//     res.status(201).json({ message: 'Category added successfully', category: newCategory });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding category', error });
//   }
// };

// // Update a category
// exports.updateCategory = async (req, res) => {
//   const { id } = req.params; // 'id' refers to the category_id passed in the URL
//   const { category_name } = req.body;

//   try {
//     const updatedCategory = await Category.findOneAndUpdate(
//       { category_id: id },
//       { category_name },
//       { new: true }
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     res.status(200).json({ message: 'Category updated', category: updatedCategory });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating category', error });
//   }
// };

// // Delete a category
// exports.deleteCategory = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedCategory = await Category.findOneAndDelete({ category_id: id });

//     if (!deletedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     res.status(200).json({ message: 'Category deleted', category: deletedCategory });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting category', error });
//   }
// };

const Category = require('../models/CategorySchema');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

// Add a new category
exports.addCategory = async (req, res) => {
    const { category_name, description } = req.body;

    if (!['Groceries', 'Beverages'].includes(category_name)) {
        return res.status(400).json({ message: 'Invalid category name' });
    }

    try {
        const newCategory = new Category({
            category_name,
            description
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error saving category', error });
    }
};

// Update category by id
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name, description } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { category_name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

// Delete category by id
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};
