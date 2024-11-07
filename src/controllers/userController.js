// const User = require('../models/userSchema');
// // Register a new user
// const registerUser = async (req, res) => {
//   const { user_name, phone_number, email, password, address } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create a new user
//     const newUser = new User({
//       user_name,
//       phone_number,
//       email,
//       password,
//       address
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully', user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all users (for admin purposes)
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { registerUser, loginUser, getUsers };


const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Register a new user
const registerUser = async (req, res) => {
  console.log('Request Body:', req.body);

  const { user_name, role_name,phone_number, email, password, confirmPassword } = req.body;
  

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      user_name,
      role_name,
      phone_number,
      email,
      password: hashedPassword // Save hashed password
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Login user
// const loginUser = async (req, res) => {
//   const { email, password} = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'no user exists with email ID' });
//     }

//     console.log(user)
//     // Check if password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ 
//         status:"failed",
//         message: 'password doesnt match' });
//     }


//     res.status(200).json({
//        status:"success",
//        message: 'Login successful', 
//        user
//       });
//   } catch (error) {
//     res.status(500).json({ 
//       status:"failed",
//       message: error.message});
//   }
// };

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User'); // Adjust the path as necessary

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        status: "failed",
        message: 'No user exists with this email ID' 
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        status: "failed",
        message: 'Password doesn’t match' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Replace with your own secret in production
      { expiresIn: '5h' } // Token expiration time
    );

    res.status(200).json({
      status: "success",
      message: 'Login successful', 
      user,
      token // Include the token in the response
    });
  } catch (error) {
    res.status(500).json({ 
      status: "failed",
      message: error.message
    });
  }
};

module.exports = { loginUser };






// Get all users (for admin purposes)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by unique ID (for admin or self-service)
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a single user by ID
const putUsersById = async (req, res) => {
try {
  const { id } = req.params;
  const updatedUserData = req.body; // Contains user data to be updated

  const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(updatedUser);

} catch (error) {
  res.status(500).json({ message: 'Failed to update user' });
}
};


// DELETE /api/users/:id
const deleteUsersById= async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};


module.exports = { registerUser, loginUser, getUsers, getUserById ,putUsersById,deleteUsersById};
