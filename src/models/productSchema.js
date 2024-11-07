// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   category: {
//     type: String,
//     ref: 'CategorySchema',
//     required: true
//   },
//   product_name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   category_id: {
//     type: String, // Use ObjectId for referencing the Category model
//     ref: 'CategorySchema', // Reference to the Category model
//     required: true,
//   },
//   product_name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ProductSchema = new Schema({
//     product_name: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     stock: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     image: {
//         type: String,
//         // required:true,
//         default:"https://www.oscommerce.com/forums/uploads/monthly_2019_10/image.png.f5e54cfd7a09e1518d64da7bd9456b59.png"
//     },
//     category_name: {
//         type: String,
//         enum: ['Groceries', 'Beverages'], // Category should be one of these
//         required: true
//     },
//     actual_price:{
//    type:Number,
//    required:true,
//     },
//     rating:{
//     type:Number,
//      default:2.5
//     },
//     created_at: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Product', ProductSchema);



const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        default: "https://www.oscommerce.com/forums/uploads/monthly_2019_10/image.png.f5e54cfd7a09e1518d64da7bd9456b59.png"
    },
    category_name: {
        type: String,
        enum: ['Groceries', 'Beverages'],
        required: true
    },
    actual_price: {
        type: Number,
        required: true,
    },
    rating:{
        type:Number,
        default:0
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }] ,// Array of reviews
    created_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Product', ProductSchema);
