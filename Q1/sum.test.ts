import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.ts';

describe('sum function', () => {
  // Two numeric strings
  it('should add two numeric strings [sum("12", "2") = 14]', () => {
    assert.strictEqual(sum("12", "2"), "14");
  });

  // String type
  it('should return a string type [sum("5", "5") = 10]', () => {
    const result = sum("5", "5");
    assert.strictEqual(typeof result, "string");
  });

  // Zeros
  it('should handle zeros [sum("0", "0") = 0]', () => {
    assert.strictEqual(sum("0", "0"), "0");
  });

  // Non-numeric strings
  it('should throw error for non-numeric [sum("12", "abc") = error]', () => {
    assert.throws(() => sum("12", "abc"), Error);
  });

  // Empty string
  it('should throw error for empty string [sum("", "10") = error]', () => {
    assert.throws(() => sum("", "5"), Error);
  });

  // Negative numbers
  it('should throw error for negative numbers [sum("-5", "10") = error]', () => {
    assert.throws(() => sum("-5", "10"), Error);
  });
});

