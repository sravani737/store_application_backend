
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
    }] ,
    created_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Product', ProductSchema);
