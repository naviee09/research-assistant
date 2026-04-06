const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ensureDbConnected = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection is not available. Please check MongoDB settings.');
  }
};

class AuthService {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User object with token
   */
  async register(name, email, password) {
    try {
      ensureDbConnected();
      console.log(`Attempting to register user with email: ${email}`);
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`User already exists with email: ${email}`);
        throw new Error('User already exists with this email');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with default values
      const user = new User({
        name,
        email,
        password: hashedPassword,
        credits: 100, // Default credits for new users
        createdAt: new Date()
      });

      console.log(`Saving new user: ${email}`);
      await user.save();
      console.log(`User saved successfully: ${email}`);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'smart_research_secret_key',
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          credits: user.credits,
          createdAt: user.createdAt
        },
        token
      };
    } catch (error) {
      console.error('Error in register:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User object with token
   */
  async login(email, password) {
    try {
      ensureDbConnected();
      console.log(`Attempting to login user with email: ${email}`);
      
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User not found with email: ${email}`);
        throw new Error('Invalid credentials');
      }

      // Check password
      console.log(`Checking password for user: ${email}`);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Invalid password for user: ${email}`);
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'smart_research_secret_key',
        { expiresIn: '7d' }
      );

      console.log(`Login successful for user: ${email}`);
      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          credits: user.credits,
          createdAt: user.createdAt
        },
        token
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    try {
      ensureDbConnected();
      console.log(`Fetching profile for user ID: ${userId}`);
      const user = await User.findById(userId).select('-password');
      if (!user) {
        console.log(`User not found with ID: ${userId}`);
        throw new Error('User not found');
      }
      console.log(`Profile fetched successfully for user ID: ${userId}`);
      return user;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updates) {
    try {
      ensureDbConnected();
      console.log(`Updating profile for user ID: ${userId}`);
      
      // Remove sensitive fields from updates
      const allowedUpdates = { ...updates };
      delete allowedUpdates.password;
      delete allowedUpdates.credits;
      delete allowedUpdates.createdAt;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        console.log(`User not found with ID: ${userId}`);
        throw new Error('User not found');
      }

      console.log(`Profile updated successfully for user ID: ${userId}`);
      return user;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      ensureDbConnected();
      console.log(`Changing password for user ID: ${userId}`);
      
      // Validate password length
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }
      
      const user = await User.findById(userId);
      if (!user) {
        console.log(`User not found with ID: ${userId}`);
        throw new Error('User not found');
      }

      // Check current password
      console.log(`Checking current password for user ID: ${userId}`);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log(`Current password is incorrect for user ID: ${userId}`);
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      console.log(`Password updated successfully for user ID: ${userId}`);
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthService();