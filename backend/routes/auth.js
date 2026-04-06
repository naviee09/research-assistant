const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('Access token required');
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'smart_research_secret_key', (err, user) => {
    if (err) {
      console.log('Invalid or expired token');
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`Registering new user with email: ${email}`);
    
    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields for registration');
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    
    const result = await authService.register(name, email, password);
    console.log(`User registered successfully with email: ${email}`);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password for login');
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const result = await authService.login(email, password);
    console.log(`Login successful for email: ${email}`);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log(`Fetching profile for user ID: ${req.user.userId}`);
    const user = await authService.getProfile(req.user.userId);
    console.log(`Profile fetched successfully for user ID: ${req.user.userId}`);
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { updates } = req.body;
    console.log(`Updating profile for user ID: ${req.user.userId}`);
    
    const user = await authService.updateProfile(req.user.userId, updates);
    console.log(`Profile updated successfully for user ID: ${req.user.userId}`);
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Change password (protected route)
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log(`Changing password for user ID: ${req.user.userId}`);
    
    if (!currentPassword || !newPassword) {
      console.log('Missing current or new password');
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
    console.log(`Password changed successfully for user ID: ${req.user.userId}`);
    res.json(result);
  } catch (error) {
    console.error('Password change error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;