const express = require('express');
const router = express.Router();
const User = require('../models/User');
const flexpriceService = require('../services/flexpriceService');

// Get user credits
router.get('/credits', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get user balance from Flexprice
    const balance = await flexpriceService.getUserBalance(userId);
    
    res.json({
      credits: balance.remaining || balance.credits || 0,
      totalCredits: balance.credits || balance.remaining || 0,
      usedCredits: balance.used || 0
    });
  } catch (error) {
    console.error('Billing credits error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get detailed usage statistics
router.get('/usage', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get detailed usage statistics from Flexprice
    const usageStats = flexpriceService.getUsageStats(userId);
    
    res.json(usageStats);
  } catch (error) {
    console.error('Billing usage error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Deduct credits
router.post('/deduct', async (req, res) => {
  try {
    const { userId, amount, eventType } = req.body;
    
    // Deduct credits using Flexprice
    const result = await flexpriceService.trackUsage(userId, eventType || 'credits_deducted', amount);
    
    res.json({
      message: 'Credits deducted successfully',
      credits: result.balance || result.remaining || 0
    });
  } catch (error) {
    console.error('Billing deduct error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add credits (for testing purposes)
router.post('/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    // Add credits using Flexprice
    const result = await flexpriceService.trackUsage(userId, 'credits_added', amount);
    
    res.json({
      message: 'Credits added successfully',
      credits: result.balance || result.remaining || 0
    });
  } catch (error) {
    console.error('Billing add error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;