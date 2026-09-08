import { describe, it, expect } from 'vitest';
import { translateProviderError } from './translate-error';
import { getUserFacingErrorMessage, getUserFacingMessage } from './error-messages';
import { LLErrorCategory } from './errors';

describe('translateProviderError', () => {
  it('maps rate-limit status 429', () => {
    const result = translateProviderError({ status: 429, message: 'Rate limit exceeded' });
    expect(result.category).toBe('rate-limit');
    expect(result.retryable).toBe(false);
  });

  it('maps quota/rate limit codes', () => {
    const result = translateProviderError({ code: 'RATE_LIMITED', message: 'quota' });
    expect(result.category).toBe('rate-limit');
  });

  it('maps connectivity timeout', () => {
    const result = translateProviderError({ code: 'timeout', message: 'request timed out' });
    expect(result.category).toBe('connectivity');
    expect(result.retryable).toBe(true);
  });

  it('maps connection errors', () => {
    const result = translateProviderError({ code: 'ECONNREFUSED', message: 'connection refused' });
    expect(result.category).toBe('connectivity');
  });

  it('maps service unavailability status 503', () => {
    const result = translateProviderError({ status: 503, message: 'Service unavailable' });
    expect(result.category).toBe('service-unavailable');
    expect(result.retryable).toBe(true);
  });

  it('maps server error status 500', () => {
    const result = translateProviderError({ status: 500, message: 'Internal server error' });
    expect(result.category).toBe('service-unavailable');
  });

  it('maps schema validation errors', () => {
    const result = translateProviderError({ message: 'Schema validation failed' });
    expect(result.category).toBe('invalid-output');
    expect(result.retryable).toBe(false);
  });

  it('maps unexpected errors to service-unavailable fallback', () => {
    const result = translateProviderError({ message: 'something unknown happened' });
    expect(result.category).toBe('service-unavailable');
  });
});

describe('getUserFacingMessage', () => {
  it('returns distinct messages for each category', () => {
    const categories: LLErrorCategory[] = ['connectivity', 'service-unavailable', 'rate-limit', 'invalid-output'];
    const messages = categories.map(getUserFacingMessage);
    expect(new Set(messages).size).toBe(categories.length);
  });

  it('connectivity message mentions retrying', () => {
    expect(getUserFacingMessage('connectivity').toLowerCase()).toContain('connection');
  });

  it('rate-limit message mentions waiting', () => {
    expect(getUserFacingMessage('rate-limit').toLowerCase()).toContain('wait');
  });

  it('service-unavailable message suggests trying later', () => {
    expect(getUserFacingMessage('service-unavailable').toLowerCase()).toContain('later');
  });

  it('invalid-output message mentions invalid', () => {
    expect(getUserFacingMessage('invalid-output').toLowerCase()).toContain('invalid');
  });
});

describe('getUserFacingErrorMessage', () => {
  it('returns category-based message for LLM error objects', () => {
    const error = { category: 'connectivity' as LLErrorCategory };
    expect(getUserFacingErrorMessage(error)).toBe(getUserFacingMessage('connectivity'));
  });

  it('returns generic message for non-categorized errors', () => {
    expect(getUserFacingErrorMessage(new Error('boom'))).toContain('unexpected');
  });
});