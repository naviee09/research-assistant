/**
 * Cache Utility
 * Simple in-memory cache for report generation with performance optimizations
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = 3 * 60 * 1000; // Reduced TTL to 3 minutes for fresher data
    this.maxSize = 50; // Limit cache size to prevent memory issues
    this.timers = new Map(); // Store timers for efficient cleanup
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.ttl) {
    // Clear existing timer if present
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    // Check cache size and evict oldest entries if needed
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
    }

    const expireTime = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expireTime
    });

    // Set timeout to automatically remove expired entries
    const timer = setTimeout(() => {
      this.delete(key);
      this.timers.delete(key);
    }, ttl);
    
    this.timers.set(key, timer);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expireTime) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all values from the cache
   */
  clear() {
    this.cache.clear();
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of entries in cache
   */
  size() {
    return this.cache.size;
  }
}

module.exports = new Cache();