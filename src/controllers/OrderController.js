// const Order = require('../models/OrderSchema');
// const Product = require('../models/productSchema');

// exports.createOrder = async (req, res) => {
//     try {
//         console.log('in order Controller');
//         console.log(req.body.userId);
//         console.log(req.body);
        
//         const { cartItems, totalAmount,userId } = req.body;
        

//         // Create order
//         const order = new Order({
//             user: userId,
//             items: cartItems.map(item => ({
//                 product: item._id,
//                 quantity: item.quantity,
//             })),
//             totalAmount,
//         });

//         // Save order in the database
//         console.log("before saving items into orders")
//         await order.save();

//         // Update product stock
      
//         for (const item of cartItems) {
//             const product = await Product.findById(item._id);
//             console.log(`Current stock for ${item._id}: ${item.quantity}`);
            
//             await Product.findByIdAndUpdate(item._id, {
//                 $inc: { stock: -item.quantity },
//             });
        
//             const updatedProduct = await Product.findById(item._id);
//             console.log(`Updated stock for ${updatedProduct}`);
//         }
//         console.log("order placed")
//         res.status(201).json({ message: 'Order placed successfully', order });
//     } catch (error) {
//         console.error('Order creation failed:', error);
//         res.status(500).json({ message: 'Failed to create order' });
//     }
// };

// exports.getUserOrders = async (req, res) => {
//     console.log("from getuserOrders controller")
//     console.log(req.params.userId);
//     try {
//         const userId = req.params.userId;
//         const orders = await Order.find({ user: userId }).populate('items.product');
//         console.log(orders);
//         res.status(200).json({ orders });
//     } catch (error) {
//         console.error('Error fetching user orders:', error);
//         res.status(500).json({ message: 'Failed to retrieve orders' });
//     }
// };

const Order = require('../models/OrderSchema');
const Product = require('../models/productSchema');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        console.log('In order controller');
        const { cartItems, totalAmount, userId } = req.body;
         console.log(cartItems);
        // Create order
        const order = new Order({
            user: userId,
            items: cartItems.map(item => ({
                product: item.productId._id,
                quantity: item.quantity,
            })),
            totalAmount,
        });

        // Save order in the database
        console.log("Before saving items into orders");
        await order.save({ session });

        // Update product stock
        for (const item of cartItems) {
            console.log(cartItems)
           

            const product = await Product.findById(item.productId._id).session(session);
            if (!product) {
                console.error(`Product with ID ${item._id} not found`);
                throw new Error(`Product not found`);
            }
            console.log(`Current stock for ${product.name}: ${product.stock}`);
            
            // Update stock
            product.stock -= item.quantity;
            await product.save({ session });

            console.log(`Updated stock for ${product.name}: ${product.stock}`);
        }

        await session.commitTransaction();
        session.endSession();
        
        console.log("Order placed");
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Order creation failed:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

exports.getUserOrders = async (req, res) => {
    const { userId } = req.body;
    console.log("from getuserOrders controller")
    console.log(req.params.userId);
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId }).populate('items.product');
        console.log(orders);
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
};

exports.getAllOrders=async(req,res)=>{
    try {
        const orders = await Order.find()
          .populate({
            path: 'items.product', // Populate product details for each item
            select: 'product_name price actual_price' // Select only necessary product fields
          })
          .select('items totalAmount status createdAt'); // Select only necessary order fields
    
        res.status(200).json(orders);
      } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ error: "Error fetching orders" });
      }
}