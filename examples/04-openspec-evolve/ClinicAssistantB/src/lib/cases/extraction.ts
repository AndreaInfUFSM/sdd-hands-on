import { AIResponse } from '../ai/types';
import { ClinicalCaseSchema } from './schema';

export function extractCaseFromLLMResponse(response: string): {
  success: true;
  case: ReturnType<typeof ClinicalCaseSchema.parse>;
} | {
  success: false;
  errors: Array<{ path: string; message: string }>;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    return {
      success: false,
      errors: [{ path: 'root', message: 'Response is not valid JSON' }],
    };
  }

  const result = ClinicalCaseSchema.safeParse(parsed);
  if (result.success) {
    return { success: true, case: result.data };
  }

  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  return { success: false, errors };
}

export function extractCaseFromAIResponse(response: AIResponse) {
  return extractCaseFromLLMResponse(response.text);
}
