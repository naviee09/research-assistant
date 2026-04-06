const express = require('express');
const router = express.Router();
const pathwayService = require('../services/pathwayService');

// Trigger data source updates
router.post('/update', async (req, res) => {
  try {
    const result = await pathwayService.updateDataSources();
    res.json(result);
  } catch (error) {
    console.error('Data update error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check data freshness
router.get('/freshness', async (req, res) => {
  try {
    const freshness = await pathwayService.checkDataFreshness();
    res.json(freshness);
  } catch (error) {
    console.error('Data freshness error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get data update history
router.get('/history', async (req, res) => {
  try {
    const history = pathwayService.getUpdateHistory();
    res.json(history);
  } catch (error) {
    console.error('Data history error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Initialize Pathway pipeline
router.post('/initialize', async (req, res) => {
  try {
    const result = await pathwayService.initializePipeline();
    res.json(result);
  } catch (error) {
    console.error('Pipeline initialization error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Perform incremental data update with real data
router.post('/incremental-update', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    // Use the improved incremental update that fetches real data
    const updatedData = await pathwayService.simulateIncrementalUpdate(query);
    res.json({
      message: 'Incremental update completed with real data',
      data: updatedData,
      count: updatedData.length
    });
  } catch (error) {
    console.error('Incremental update error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;