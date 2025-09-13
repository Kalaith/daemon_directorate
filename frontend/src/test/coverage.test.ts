// src/test/coverage.test.ts
import { describe, it, expect } from 'vitest';

describe('Test Coverage Examples', () => {
  it('demonstrates basic assertions', () => {
    expect(true).toBe(true);
    expect('hello').toBeDefined();
    expect([1, 2, 3]).toHaveLength(3);
    expect({ name: 'test' }).toHaveProperty('name');
  });

  it('demonstrates async testing', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  it('demonstrates error testing', () => {
    const throwError = () => {
      throw new Error('Test error');
    };
    
    expect(throwError).toThrow('Test error');
  });

  it('demonstrates array and object matching', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      tags: ['admin', 'user']
    };

    expect(user).toMatchObject({
      name: 'John',
      email: expect.stringContaining('@')
    });

    expect(user.tags).toContain('admin');
    expect(user.tags).toEqual(expect.arrayContaining(['user']));
  });

  it('demonstrates number and string matching', () => {
    expect(Math.PI).toBeCloseTo(3.14, 2);
    expect('hello world').toMatch(/world/);
    expect('test@example.com').toMatch(/^[\w\.-]+@[\w\.-]+\.\w+$/);
  });
});
