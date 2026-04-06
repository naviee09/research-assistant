const express = require('express');
const router = express.Router();
const ResearchReport = require('../models/ResearchReport');
const User = require('../models/User');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Fetching dashboard stats for user ID: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    // Get total reports
    console.log(`Counting total reports for user ID: ${userId}`);
    const totalReports = await ResearchReport.countDocuments({ userId });
    console.log(`Total reports count: ${totalReports}`);
    
    // Get fresh reports (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    console.log(`Counting fresh reports for user ID: ${userId}`);
    const freshReports = await ResearchReport.countDocuments({
      userId: userId,
      createdAt: { $gte: oneWeekAgo }
    });
    console.log(`Fresh reports count: ${freshReports}`);
    
    // Get user credits
    console.log(`Fetching user credits for user ID: ${userId}`);
    const user = await User.findById(userId);
    const credits = user ? user.credits : 0;
    console.log(`User credits: ${credits}`);
    
    // Get recent reports
    console.log(`Fetching recent reports for user ID: ${userId}`);
    const recentReports = await ResearchReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('question createdAt keyTakeaways sources');
    console.log(`Recent reports count: ${recentReports.length}`);
    
    const result = {
      totalReports,
      freshReports,
      credits,
      recentReports
    };
    
    console.log(`Dashboard stats fetched successfully for user ID: ${userId}`);
    res.json(result);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get report history with pagination
router.get('/reports', async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`Fetching report history for user ID: ${userId}, page: ${page}, limit: ${limit}`);
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const reports = await ResearchReport.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('question createdAt keyTakeaways sources');
    
    const total = await ResearchReport.countDocuments({ userId });
    
    const result = {
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalReports: total
    };
    
    console.log(`Report history fetched successfully for user ID: ${userId}`);
    res.json(result);
  } catch (error) {
    console.error('Report history error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user profile information
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Fetching profile for user ID: ${userId}`);
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log(`User not found with ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    const result = {
      id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      createdAt: user.createdAt
    };
    
    console.log(`Profile fetched successfully for user ID: ${userId}`);
    res.json(result);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;