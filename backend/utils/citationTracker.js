/**
 * Citation Tracker Utility
 * This utility handles citation generation and source tracking for research reports
 */

class CitationTracker {
  constructor() {
    this.sources = [];
  }

  /**
   * Add a source to the tracker
   * @param {Object} source - Source information
   * @param {string} source.title - Source title
   * @param {string} source.url - Source URL (optional)
   * @param {string} source.description - Source description
   * @param {Date} source.date - Publication date
   * @param {string} source.type - Source type (file/live)
   * @param {string} source.fileId - File ID (for file sources)
   * @returns {number} Source ID
   */
  addSource(source) {
    const sourceId = this.sources.length;
    this.sources.push({
      id: sourceId,
      ...source
    });
    return sourceId;
  }

  /**
   * Generate a citation for a source
   * @param {number} sourceId - Source ID
   * @returns {string} Formatted citation
   */
  generateCitation(sourceId) {
    const source = this.sources[sourceId];
    if (!source) {
      return '';
    }

    // Format citation based on source type
    if (source.type === 'file') {
      return `${source.title}.`;
    } else {
      return `${source.title}. Retrieved from ${source.url}. Accessed ${source.date.toLocaleDateString()}.`;
    }
  }

  /**
   * Get all sources
   * @returns {Array} All tracked sources
   */
  getSources() {
    return this.sources;
  }

  /**
   * Clear all sources
   */
  clearSources() {
    this.sources = [];
  }

  /**
   * Generate bibliography
   * @returns {Array} Formatted bibliography entries
   */
  generateBibliography() {
    return this.sources.map((source, index) => {
      if (source.type === 'file') {
        return `${index + 1}. ${source.title}.`;
      } else {
        return `${index + 1}. ${source.title}. Retrieved from ${source.url}. Published ${source.date.toLocaleDateString()}.`;
      }
    });
  }
}

module.exports = CitationTracker;