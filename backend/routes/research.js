const express = require('express');
const router = express.Router();
const ResearchReport = require('../models/ResearchReport');
const researchAssistant = require('../agents/researchAssistant');
const flexpriceService = require('../services/flexpriceService');

// Submit a research question
router.post('/', async (req, res) => {
  try {
    const { question, userId } = req.body;
    
    console.log(`Received research request: ${question} from user: ${userId}`);
    
    // Validate inputs
    if (!question || !userId) {
      console.log(`Missing parameters: question=${!!question}, userId=${!!userId}`);
      return res.status(400).json({ 
        message: 'Question and userId are required',
        code: 'MISSING_PARAMETERS'
      });
    }
    
    // Track usage with Flexprice for question asked (non-blocking)
    try {
      console.log(`Tracking usage for user: ${userId}, event: question_asked`);
      // Don't await this - track in background
      flexpriceService.trackUsage(userId, 'question_asked').catch(err => {
        console.warn('Failed to track usage:', err.message);
      });
    } catch (usageError) {
      console.warn('Failed to initiate usage tracking:', usageError.message);
    }
    
    // Process the research question using the research assistant agent
    console.log(`Processing research question for user: ${userId}`);
    const report = await researchAssistant.processQuestion(question, userId);
    console.log(`Research report generated for user: ${userId}`);
    
    // Track usage with Flexprice for report generated (non-blocking)
    try {
      console.log(`Tracking usage for user: ${userId}, event: report_generated`);
      // Don't await this - track in background
      flexpriceService.trackUsage(userId, 'report_generated').catch(err => {
        console.warn('Failed to track usage:', err.message);
      });
    } catch (usageError) {
      console.warn('Failed to initiate usage tracking:', usageError.message);
    }
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Research submission error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to generate research report',
      code: 'RESEARCH_PROCESSING_ERROR'
    });
  }
});

// Get a specific research report
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log(`Fetching research report with ID: ${reportId}`);
    
    const report = await ResearchReport.findById(reportId);
    if (!report) {
      console.log(`Report not found with ID: ${reportId}`);
      return res.status(404).json({ 
        message: 'Report not found',
        code: 'REPORT_NOT_FOUND'
      });
    }
    
    console.log(`Report fetched successfully with ID: ${reportId}`);
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to retrieve report',
      code: 'REPORT_RETRIEVAL_ERROR'
    });
  }
});

// Get all research reports for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Fetching all research reports for user: ${userId}`);
    
    if (!userId) {
      console.log('Missing userId parameter');
      return res.status(400).json({ 
        message: 'userId is required',
        code: 'MISSING_USER_ID'
      });
    }
    
    const reports = await ResearchReport.find({ userId }).sort({ createdAt: -1 });
    console.log(`Found ${reports.length} reports for user: ${userId}`);
    
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to retrieve reports',
      code: 'REPORTS_RETRIEVAL_ERROR'
    });
  }
});

// Refresh a research report with new data
router.post('/:id/refresh', async (req, res) => {
  try {
    const { userId } = req.body;
    const reportId = req.params.id;
    
    console.log(`Refreshing research report with ID: ${reportId} for user: ${userId}`);
    
    // Validate inputs
    if (!userId) {
      console.log('Missing userId parameter');
      return res.status(400).json({ 
        message: 'userId is required',
        code: 'MISSING_USER_ID'
      });
    }
    
    // Get the existing report
    console.log(`Fetching existing report with ID: ${reportId}`);
    const existingReport = await ResearchReport.findById(reportId);
    if (!existingReport) {
      console.log(`Report not found with ID: ${reportId}`);
      return res.status(404).json({ 
        message: 'Report not found',
        code: 'REPORT_NOT_FOUND'
      });
    }
    
    // Track usage with Flexprice for report refresh (non-blocking)
    try {
      console.log(`Tracking usage for user: ${userId}, event: report_refreshed`);
      // Don't await this - track in background
      flexpriceService.trackUsage(userId, 'report_refreshed').catch(err => {
        console.warn('Failed to track usage:', err.message);
      });
    } catch (usageError) {
      console.warn('Failed to initiate usage tracking:', usageError.message);
    }
    
    // Process the research question again with fresh data
    console.log(`Processing research question again: ${existingReport.question} for user: ${userId}`);
    const refreshedReport = await researchAssistant.processQuestion(existingReport.question, userId);
    console.log(`Report refreshed successfully for user: ${userId}`);
    
    res.status(200).json(refreshedReport);
  } catch (error) {
    console.error('Refresh report error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to refresh report',
      code: 'REPORT_REFRESH_ERROR'
    });
  }
});

module.exports = router;