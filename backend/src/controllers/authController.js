const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Basic input validation (can be expanded with a library like Joi)
const validateInput = (email, password) => {
  if (!email || !password || password.length < 6) {
    return 'Invalid input: Email is required and password must be at least 6 characters.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid input: Please provide a valid email address.';
  }
  return null; // No error
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const validationError = validateInput(email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const newUser = await User.create(email, password, firstName, lastName, phoneNumber);
    // Don't send password_hash back
    const userResponse = { ...newUser };
    delete userResponse.password_hash;

    // Optionally, generate a JWT token upon registration
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse,
      token // Send token if auto-login after registration
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateInput(email, password);
    if (validationError) {
      // More generic message for login to avoid confirming if email exists or not
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' }); // Generic message
    }

    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' }); // Generic message
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    // Don't send password_hash back
    const userResponse = { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name };

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
