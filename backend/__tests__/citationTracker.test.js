const CitationTracker = require('../utils/citationTracker');

describe('CitationTracker', () => {
  let citationTracker;

  beforeEach(() => {
    citationTracker = new CitationTracker();
  });

  describe('addSource', () => {
    it('should add a source and return an ID', () => {
      const source = {
        title: 'Test Source',
        url: 'https://example.com',
        description: 'Test description',
        date: new Date(),
        type: 'live'
      };

      const sourceId = citationTracker.addSource(source);
      
      expect(sourceId).toBe(0);
      expect(citationTracker.getSources()).toHaveLength(1);
    });
  });

  describe('generateCitation', () => {
    it('should generate a citation for a file source', () => {
      const source = {
        title: 'Test File',
        description: 'Test description',
        date: new Date(),
        type: 'file'
      };

      const sourceId = citationTracker.addSource(source);
      const citation = citationTracker.generateCitation(sourceId);
      
      expect(citation).toBe('Test File.');
    });

    it('should generate a citation for a live source', () => {
      const source = {
        title: 'Test Article',
        url: 'https://example.com',
        description: 'Test description',
        date: new Date(),
        type: 'live'
      };

      const sourceId = citationTracker.addSource(source);
      const citation = citationTracker.generateCitation(sourceId);
      
      expect(citation).toContain('Test Article');
      expect(citation).toContain('https://example.com');
    });
  });

  describe('generateBibliography', () => {
    it('should generate a bibliography', () => {
      const source1 = {
        title: 'Test File',
        description: 'Test description',
        date: new Date(),
        type: 'file'
      };

      const source2 = {
        title: 'Test Article',
        url: 'https://example.com',
        description: 'Test description',
        date: new Date(),
        type: 'live'
      };

      citationTracker.addSource(source1);
      citationTracker.addSource(source2);
      
      const bibliography = citationTracker.generateBibliography();
      
      expect(bibliography).toHaveLength(2);
      expect(bibliography[0]).toBe('1. Test File.');
      expect(bibliography[1]).toContain('2. Test Article');
    });
  });
});