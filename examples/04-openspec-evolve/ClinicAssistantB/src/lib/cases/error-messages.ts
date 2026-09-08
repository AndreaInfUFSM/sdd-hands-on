import { LLErrorCategory } from './errors';

export const ERROR_DISPLAY_MESSAGES: Record<LLErrorCategory, string> = {
  connectivity: 'Connection to the AI service failed. Please check your internet connection and try again.',
  'service-unavailable': 'The AI service is currently unavailable. Please try again later.',
  'rate-limit': 'The AI service rate limit has been reached. Please wait a moment and try again.',
  'invalid-output': 'The AI service returned an invalid response. Please try generating the case again.',
};

export function getUserFacingMessage(category: LLErrorCategory): string {
  return ERROR_DISPLAY_MESSAGES[category];
}

export function getUserFacingErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'category' in error) {
    const category = (error as { category: LLErrorCategory }).category;
    return getUserFacingMessage(category);
  }
  return 'An unexpected error occurred. Please try again.';
}