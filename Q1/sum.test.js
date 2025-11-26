import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.js';

describe('sum function', () => {
  it('should add two numeric strings', () => {
    console.log(sum("12", "2"));
    assert.strictEqual(sum("12", "2"), "14");
  });

  it('should return a string type', () => {
    const result = sum("5", "5");
    assert.strictEqual(typeof result, "string");
  });

  it('should handle zeros', () => {
    assert.strictEqual(sum("0", "0"), "0");
  });

  it('should throw error for non-numeric string', () => {
    assert.throws(() => sum("12", "abc"), Error);
  });

  it('should throw error for empty string', () => {
    assert.throws(() => sum("", "5"), Error);
  });

  it('should throw error for negative numbers', () => {
    assert.throws(() => sum("-5", "10"), Error);
  });
});