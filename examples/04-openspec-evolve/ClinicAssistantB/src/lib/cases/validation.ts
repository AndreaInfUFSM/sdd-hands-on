import { CaseGenerationInput, CaseGenerationInputSchema, CaseGenerationInputError } from './inputs';

export function validateCaseInput(input: unknown): {
  success: true;
  data: CaseGenerationInput;
} | {
  success: false;
  errors: CaseGenerationInputError[];
} {
  const result = CaseGenerationInputSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: CaseGenerationInputError[] = result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
  return { success: false, errors };
}
