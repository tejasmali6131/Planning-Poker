const generateId = require('../../utils/generateId');

describe('generateId', () => {
  test('should generate a string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  test('should generate an ID with 6 characters', () => {
    const id = generateId();
    expect(id).toHaveLength(6);
  });

  test('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  test('should generate IDs containing only alphanumeric characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-zA-Z0-9]{6}$/);
  });

  test('should generate multiple unique IDs in succession', () => {
    const ids = new Set();
    const iterations = 100;
    
    for (let i = 0; i < iterations; i++) {
      const id = generateId();
      expect(id).toHaveLength(6);
      expect(typeof id).toBe('string');
      ids.add(id);
    }
    
    // All IDs should be unique
    expect(ids.size).toBe(iterations);
  });

  test('should not generate undefined or null', () => {
    const id = generateId();
    expect(id).not.toBeUndefined();
    expect(id).not.toBeNull();
  });

  test('should handle multiple rapid calls', () => {
    const promises = Array.from({ length: 50 }, () => 
      Promise.resolve(generateId())
    );
    
    return Promise.all(promises).then(ids => {
      // All should be strings
      ids.forEach(id => {
        expect(typeof id).toBe('string');
        expect(id).toHaveLength(6);
      });
      
      // All should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(50);
    });
  });
});
