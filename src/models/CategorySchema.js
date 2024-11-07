// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//   category_id: {
//     type: String,      // UUIDs are stored as strings in MongoDB
//     required: true,
//     unique: true       // Equivalent to Primary Key
//   },
//   category_name: {
//     type: String,
//     required: true     // Not null constraint
//   }
// });

// module.exports = mongoose.model('Category', categorySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: {
        type: String,
        enum: ['Groceries', 'Beverages'],
        required: true
    },
    description: String
});

module.exports = mongoose.model('Category', CategorySchema);
