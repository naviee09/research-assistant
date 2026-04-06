const researchAssistant = require('../agents/researchAssistant');

describe('ResearchAssistantAgent', () => {

  describe('combineResults', () => {
    it('should combine file and live results', () => {
      const fileResults = [
        { content: 'File content 1', source: { title: 'File 1', type: 'file' } }
      ];
      const liveResults = [
        { content: 'Live content 1', source: { title: 'Live 1', type: 'live' } }
      ];

      const combined = researchAssistant.combineResults(fileResults, liveResults);
      
      expect(combined).toHaveLength(2);
      expect(combined[0].content).toBe('File content 1');
      expect(combined[1].content).toBe('Live content 1');
    });
  });

  describe('extractSources', () => {
    it('should extract sources with metadata', () => {
      const combinedResults = [
        {
          content: 'Content 1',
          source: {
            title: 'Source 1',
            url: 'https://example.com',
            date: new Date(),
            type: 'live'
          }
        }
      ];

      const sources = researchAssistant.extractSources(combinedResults);
      
      expect(sources).toHaveLength(1);
      expect(sources[0].title).toBe('Source 1');
      expect(sources[0].type).toBe('live');
    });
  });
});