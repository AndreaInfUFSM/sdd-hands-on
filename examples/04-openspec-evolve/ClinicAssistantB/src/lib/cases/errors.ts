export type LLErrorCategory = 'connectivity' | 'service-unavailable' | 'rate-limit' | 'invalid-output';

export const LL_ERROR_CATEGORIES: readonly LLErrorCategory[] = [
  'connectivity',
  'service-unavailable',
  'rate-limit',
  'invalid-output',
];

export interface LLMError {
  category: LLErrorCategory;
  message: string;
  retryable: boolean;
}

export class LLMRequestError extends Error {
  readonly category: LLErrorCategory;
  readonly retryable: boolean;

  constructor(category: LLErrorCategory, message: string) {
    super(message);
    this.name = 'LLMRequestError';
    this.category = category;
    this.retryable = category === 'connectivity' || category === 'service-unavailable';
  }
}