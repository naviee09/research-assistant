const cache = require('../utils/cache');

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cache.set('testKey', 'testValue');
      const value = cache.get('testKey');
      
      expect(value).toBe('testValue');
    });

    it('should return null for non-existent keys', () => {
      const value = cache.get('nonExistentKey');
      
      expect(value).toBeNull();
    });

    it('should return null for expired keys', (done) => {
      cache.set('expiringKey', 'expiringValue', 10); // 10ms TTL
      
      setTimeout(() => {
        const value = cache.get('expiringKey');
        expect(value).toBeNull();
        done();
      }, 20);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      cache.set('keyToDelete', 'value');
      cache.delete('keyToDelete');
      
      const value = cache.get('keyToDelete');
      expect(value).toBeNull();
    });
  });

  describe('size', () => {
    it('should return the correct cache size', () => {
      expect(cache.size()).toBe(0);
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.size()).toBe(2);
    });
  });
});