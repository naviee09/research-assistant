const axios = require('axios');

class FlexpriceService {
  constructor() {
    this.apiKey = process.env.FLEXPRICE_API_KEY;
    this.baseUrl = process.env.FLEXPRICE_BASE_URL || 'http://localhost:5002/api';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Track usage event
   * @param {string} userId - User ID
   * @param {string} eventType - Type of event (e.g., 'question_asked', 'report_generated')
   * @param {number} value - Value of the event (default: 1)
   * @returns {Promise<Object>} API response
   */
  async trackUsage(userId, eventType, value = 1) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        console.warn('Flexprice API key not configured, skipping usage tracking');
        // For demo purposes, track usage in memory
        this.trackUsageInMemory(userId, eventType, value);
        return { success: true, message: 'Usage tracked in memory (no API key)', balance: this.getUserBalanceInMemory(userId) };
      }
      
      console.log(`Tracking usage: ${eventType} for user ${userId}`);
      
      // In a real implementation, this would call the Flexprice API
      // For now, we'll simulate success and return mock balance
      this.trackUsageInMemory(userId, eventType, value);
      return { 
        success: true, 
        message: 'Usage tracked successfully', 
        balance: this.getUserBalanceInMemory(userId) 
      };
    } catch (error) {
      console.error('Error tracking usage with Flexprice:', error.response?.data || error.message);
      // Don't fail the entire request if usage tracking fails
      return { success: false, message: 'Usage tracking failed but request completed' };
    }
  }

  /**
   * Track usage in memory for demo purposes
   * @param {string} userId - User ID
   * @param {string} eventType - Type of event
   * @param {number} value - Value of the event
   */
  trackUsageInMemory(userId, eventType, value) {
    // Initialize user usage tracking if not exists
    if (!global.userUsage) {
      global.userUsage = {};
    }
    if (!global.userUsage[userId]) {
      global.userUsage[userId] = {
        credits: 100,
        used: 0,
        events: []
      };
    }
    
    // Track the event
    global.userUsage[userId].events.push({
      type: eventType,
      value: value,
      timestamp: new Date()
    });
    
    // Update credit usage based on event type
    if (eventType === 'question_asked') {
      global.userUsage[userId].used += 1;
    } else if (eventType === 'report_generated') {
      global.userUsage[userId].used += 1;
    } else if (eventType === 'report_refreshed') {
      global.userUsage[userId].used += 1;
    }
  }

  /**
   * Get user balance from memory for demo purposes
   * @param {string} userId - User ID
   * @returns {Object} User balance information
   */
  getUserBalanceInMemory(userId) {
    if (global.userUsage && global.userUsage[userId]) {
      return {
        credits: global.userUsage[userId].credits,
        used: global.userUsage[userId].used,
        remaining: global.userUsage[userId].credits - global.userUsage[userId].used
      };
    }
    return {
      credits: 100,
      used: 0,
      remaining: 100
    };
  }

  /**
   * Get detailed usage statistics
   * @param {string} userId - User ID
   * @returns {Object} Detailed usage statistics
   */
  getUsageStats(userId) {
    if (global.userUsage && global.userUsage[userId]) {
      const user = global.userUsage[userId];
      const questionCount = user.events.filter(e => e.type === 'question_asked').length;
      const reportCount = user.events.filter(e => e.type === 'report_generated').length;
      const refreshCount = user.events.filter(e => e.type === 'report_refreshed').length;
      
      return {
        questionsAsked: questionCount,
        reportsGenerated: reportCount,
        reportsRefreshed: refreshCount,
        totalCreditsUsed: user.used,
        remainingCredits: user.credits - user.used
      };
    }
    return {
      questionsAsked: 0,
      reportsGenerated: 0,
      reportsRefreshed: 0,
      totalCreditsUsed: 0,
      remainingCredits: 100
    };
  }

  /**
   * Get user credits/balance
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User balance information
   */
  async getUserBalance(userId) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        console.warn('Flexprice API key not configured, returning default balance');
        // Return mock data from memory if API key not configured
        return this.getUserBalanceInMemory(userId);
      }
      
      // In a real implementation, this would call the Flexprice API
      // For now, we'll return mock data from memory
      return this.getUserBalanceInMemory(userId);
    } catch (error) {
      console.error('Error getting user balance from Flexprice:', error.response?.data || error.message);
      // Return mock data if API fails
      return this.getUserBalanceInMemory(userId);
    }
  }

  /**
   * Deduct credits from user balance
   * @param {string} userId - User ID
   * @param {number} amount - Amount to deduct
   * @returns {Promise<Object>} Deduction result
   */
  async deductCredits(userId, amount) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        console.warn('Flexprice API key not configured, skipping credit deduction');
        return {
          success: true,
          message: 'Credit deduction skipped (no API key)',
          remaining: this.getUserBalanceInMemory(userId).remaining
        };
      }
      
      console.log(`Deducting ${amount} credits for user ${userId}`);
      // In a real implementation, this would call the Flexprice API
      // For now, we'll simulate success
      return {
        success: true,
        message: 'Credits deducted successfully',
        remaining: this.getUserBalanceInMemory(userId).remaining - amount
      };
    } catch (error) {
      console.error('Error deducting credits with Flexprice:', error.response?.data || error.message);
      // Don't fail the entire request if credit deduction fails
      return {
        success: false,
        message: 'Credit deduction failed but request completed',
        remaining: this.getUserBalanceInMemory(userId).remaining
      };
    }
  }

  /**
   * Add credits to user balance
   * @param {string} userId - User ID
   * @param {number} amount - Amount to add
   * @returns {Promise<Object>} Addition result
   */
  async addCredits(userId, amount) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        console.warn('Flexprice API key not configured, skipping credit addition');
        return {
          success: true,
          message: 'Credit addition skipped (no API key)',
          total: this.getUserBalanceInMemory(userId).credits
        };
      }
      
      console.log(`Adding ${amount} credits for user ${userId}`);
      // In a real implementation, this would call the Flexprice API
      // For now, we'll simulate success
      return {
        success: true,
        message: 'Credits added successfully',
        total: this.getUserBalanceInMemory(userId).credits + amount
      };
    } catch (error) {
      console.error('Error adding credits with Flexprice:', error.response?.data || error.message);
      // Don't fail the entire request if credit addition fails
      return {
        success: false,
        message: 'Credit addition failed but request completed',
        total: this.getUserBalanceInMemory(userId).credits
      };
    }
  }
}

module.exports = new FlexpriceService();