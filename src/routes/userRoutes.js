const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken')
// const { registerUser, loginUser, getUsers } = require('../controllers/userController');
const userController = require('../controllers/userController')
const router = express.Router();

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get all users (for admin purposes, this can be protected)
router.get('/', authenticateToken,userController.getUsers);

//Endpoint to get an user by id
router.get('/:id',userController.getUserById);

// end point to UPDATE an user by id
router.put('/:id',authenticateToken,userController.putUsersById);

//delete user by id
router.delete('/:id',authenticateToken,userController.deleteUsersById);

module.exports = router;
