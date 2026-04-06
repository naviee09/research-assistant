const pathwayService = require('./services/pathwayService');

async function testPathwayService() {
  try {
    console.log('Testing Pathway Service...');
    console.log('Current working directory:', process.cwd());
    console.log('News API Key from env:', process.env.NEWS_API_KEY ? 'Found' : 'Not found');
    if (process.env.NEWS_API_KEY) {
      console.log('News API Key length:', process.env.NEWS_API_KEY.length);
    }
    
    // Test the pathway service directly
    const results = await pathwayService.fetchLiveData('artificial intelligence');
    
    console.log('Pathway service response:', {
      resultsCount: results.length,
      firstResult: results.length > 0 ? {
        title: results[0].title,
        source: results[0].source,
        contentLength: results[0].content ? results[0].content.length : 0
      } : null
    });
    
    console.log('Pathway service is working correctly!');
  } catch (error) {
    console.error('Error testing Pathway Service:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testPathwayService();