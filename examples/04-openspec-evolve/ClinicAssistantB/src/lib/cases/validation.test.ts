import { describe, it, expect } from 'vitest';
import { validateCaseInput } from './validation';

const validInput = {
  topic: 'Acute Coronary Syndrome',
  learningObjective: 'Identify the differential diagnosis for chest pain.',
  pedagogicalRationale: 'ACS is a high-yield topic for medical students.',
  sourceText: 'AHA/ACC Guidelines for STEMI management 2024.',
};

describe('validateCaseInput', () => {
  it('accepts all required inputs provided', () => {
    const result = validateCaseInput(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects missing required field', () => {
    const { topic: _topic, ...noTopic } = validInput;
    void _topic;
    const result = validateCaseInput(noTopic);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.field === 'topic')).toBe(true);
    }
  });

  it('rejects invalid type', () => {
    const invalid = { ...validInput, topic: 123 };
    const result = validateCaseInput(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.field === 'topic')).toBe(true);
    }
  });

  it('rejects text exceeding length constraint', () => {
    const longText = 'x'.repeat(201);
    const invalid = { ...validInput, topic: longText };
    const result = validateCaseInput(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.field === 'topic' && e.message.includes('200'))).toBe(true);
    }
  });

  it('rejects empty string fields', () => {
    const invalid = { ...validInput, topic: '' };
    const result = validateCaseInput(invalid);
    expect(result.success).toBe(false);
  });
});
