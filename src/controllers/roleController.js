const Role = require('../models/roleSchema');

// Create a new role
const createRole = async (req, res) => {
  const { role_name } = req.body;

  try {
    const newRole = new Role({ role_name });
    await newRole.save();
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRole, getRoles };
