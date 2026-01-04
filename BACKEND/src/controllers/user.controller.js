import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.model.js';
import bcrypt from 'bcryptjs';

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //const salt = await bcrypt.genSalt(10);
  //const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

   // Example success response
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'User registered successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password'); // exclude passwords
  res.status(200).json(users);
});

// Delete user by ID
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.remove();
  res.status(200).json({ message: 'User deleted successfully' });
});

export { registerUser, getAllUsers, deleteUser };
