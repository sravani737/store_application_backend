const Cart = require('../models/CartSchema');
const mongoose = require('mongoose');
const Product = require('../models/productSchema'); // Make sure you have imported the Product model

// Add item to cart
// exports.addToCart = async (req, res) => {

//   const {userId,items} = req.body;

//   if (!userId || !items || items.length === 0) {
//     return res.status(400).json({ error: 'userId and items are required' });
//   }

//   try {
//     console.log(Cart)
//     let cart = await Cart.findOne({ userId });
//     console.log(Cart)

//     // If no cart exists, create a new one
//     if (!cart) {
//       cart = new Cart({ userId, items: [], totalPrice: 0 });
//     }

//     // Loop through each item and add or update the quantity in the cart
//     for (let item of items) {
//       const { productId, quantity } = item;

//       // Check if productId is valid
//       if (!productId) {
//         return res.status(400).json({ error: 'productId is required' });
//       }

//       // Check if the product is already in the cart
//       const existingItem = cart.items.find((i) => i.productId?.toString() === productId);

//       if (existingItem) {
//         // If product exists in cart, update the quantity
//         existingItem.quantity += quantity;
//       } else {
//         // If product doesn't exist in cart, add it
//         cart.items.push({ productId, quantity });
//       }

//       // Fetch product price from Product model to calculate total price
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ error: `Product with id ${productId} not found` });
//       }
//       cart.totalPrice += product.price * quantity;
//     }

//     // Save the updated cart
//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error while adding to cart:', error);
//     res.status(500).json({ error: 'Failed to add to cart' });
//   }
// };




exports.addToCart = async (req, res) => {
  console.log("Request received");
  console.log(req.body)
  const { userId, productId, productName, price, quantity, image } = req.body;
 console.log('productId:', productId);
console.log('productName:', productName);
console.log('price:', price);
console.log('quantity:', quantity);
console.log('image:', image);

  // Check for missing fields
  if (!userId || !productId || !productName || !price || !quantity || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Searching for cart of user:', userId);
    
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log('Cart not found, creating new cart');
      
      // If no cart found, create a new one
      cart = new Cart({
        userId,
        items: [{ productId: new mongoose.Types.ObjectId(productId), productName, price, quantity, image }],
        totalPrice: price * quantity, // Calculate initial total price
      });
    } else {
      console.log('Cart found, updating cart');

      // Convert productId from request body to ObjectId
      const productObjectId =new  mongoose.Types.ObjectId(productId);

      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(item => 
        item.productId && item.productId.equals(productObjectId) // Ensure item.productId is defined
      );

      if (existingItemIndex > -1) {
        console.log('Product found in cart, updating quantity');
        
        // If item exists, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        console.log('Product not in cart, adding new item');
        const newItem = {
          productId: req.body.productId,
          productName: req.body.productName,
          price: req.body.price,
          quantity: req.body.quantity,
          image: req.body.image
      }
        // If item does not exist, push it into the items array
        console.log('from cart'+newItem);
        cart.items.push(newItem);
      }

      // Update the total price
      // cart.totalPrice += price * quantity;
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    // Save the cart
    console.log('Cart before save:', cart);
    await cart.save();

    console.log('Item added to cart successfully');
    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart', details: error });
  }
};


//update
exports.update = async (req, res) => {
 console.log(req.body);
const { userId, productId, quantity } = req.body;

try {
  // Find the user's cart by user ID
  console.log("in try block of updatinng cart");
  const cart = await Cart.findOne({ userId });
 
   console.log("after finding user",cart);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  console.log("after finding cart");
  // Find the product in the cart
  console.log(`Looking for productId: ${productId} in cart`);

  const productIndex = cart.items.findIndex(item => item._id.toString() === productId.toString());
  console.log("after finding productId in cart productIndex is: ",productIndex);
  if (productIndex > -1) {
    // Update the quantity of the product
    cart.items[productIndex].quantity = quantity;
    console.log("before saving");
    // Save the updated cart
    await cart.save();

    res.json({ message: 'Cart updated successfully', cart });
  } else {
    console.log("from else");
    res.status(404).json({ message: 'Product not found in cart' });
  }
} catch (error) {
  console.error('Error updating cart:', error);
  res.status(500).json({ message: 'Internal server error' });
}
};


  

// Get cart items for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching cart for user:', userId);

  try {
    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate('items.productId', 'product_name price image');
    
    if (!cart) {
      console.log('Cart not found');
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      console.log('Cart is empty');
      return res.status(200).json({ message: 'Cart is empty', items: [], totalPrice: 0 });
    }

    console.log('Cart fetched successfully');
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart', details: error });
  }
};

// Remove a single item from cart
exports.removeFromCart = async (req, res) => {
  console.log("---------------------fromFromCart-------------------")
  const { userId, productId } = req.params;
  console.log(userId,productId)

  try {
    const cart = await Cart.findOne({ userId });
   
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    console.log("usercart Found");
    cart.items = cart.items.filter((item) => item._id.toString() !== productId);
    console.log("before removing the item from cart");
    await cart.save();
    console.log(cart);
    console.log('---------------------------------------------')
     cart.items =  cart.items.filter(item => item.quantity > 0);
     console.log(cart)
     console.log("item removed from the cart"+productId);
    res.status(200).json({
     cart
    });    
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};


// Clear all items from cart
exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  console.log("from clearCart")
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = []; // Clear all items
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};



// const Order = require('../models/OrderSchema');

// // Add product to cart
// exports.addToCart = async (req, res) => {
//     try {
//         const { userId, productId, productName, price } = req.body;

//         // Check if product is already in cart
//         let cartItem = await Cart.findOne({ userId, productId });
//         if (cartItem) {
//             return res.status(400).json({ message: 'Product already in cart' });
//         }

//         // Create new cart item
//         cartItem = new Cart({
//             userId,
//             productId,
//             productName,
//             price,
//             quantity: 1,
//             totalPrice: price
//         });

//         await cartItem.save();
//         res.status(201).json(cartItem);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// exports.updateCartQuantity = async (req, res) => {
//     try {
//         const { cartId, quantity } = req.body;

//         // Find cart item by id
//         let cartItem = await Cart.findById(cartId);
//         if (!cartItem) {
//             return res.status(404).json({ message: 'Cart item not found' });
//         }

//         // Update quantity and total price
//         cartItem.quantity = quantity;
//         cartItem.totalPrice = cartItem.price * quantity;

//         await cartItem.save();
//         res.status(200).json(cartItem);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // Remove from cart
// exports.removeFromCart = async (req, res) => {
//     try {
//         const { cartId } = req.body;

//         // Find and remove cart item
//         const cartItem = await Cart.findByIdAndDelete(cartId);
//         if (!cartItem) {
//             return res.status(404).json({ message: 'Cart item not found' });
//         }

//         res.status(200).json({ message: 'Item removed from cart' });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // Checkout and create order
// exports.checkout = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         // Get user's cart items
//         const cartItems = await Cart.find({ userId, status: 'pending' });
//         if (cartItems.length === 0) {
//             return res.status(400).json({ message: 'No items in cart' });
//         }

//         // Calculate total amount
//         const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
//         const gstAmount = totalAmount * 0.18; // Example GST (18%)

//         // Create new order
//         const newOrder = new Order({
//             userId,
//             items: cartItems,
//             totalAmount: totalAmount + gstAmount + 50, // Including GST and delivery charges
//             gstAmount,
//             deliveryCharges: 50, // Fixed delivery charge
//             paymentStatus: 'completed'
//         });

//         await newOrder.save();

//         // Update stock for products
//         for (let item of cartItems) {
//             let product = await Product.findById(item.productId);
//             product.stock -= item.quantity;
//             await product.save();
//         }

//         // Mark cart items as ordered
//         await Cart.updateMany({ userId, status: 'pending' }, { status: 'ordered' });

//         res.status(201).json(newOrder);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };
