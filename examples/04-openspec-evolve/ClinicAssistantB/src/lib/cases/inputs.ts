import { z } from 'zod';

export const CaseGenerationInputSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200, 'Topic must be 200 characters or fewer'),
  learningObjective: z.string().min(1, 'Learning objective is required').max(500, 'Learning objective must be 500 characters or fewer'),
  pedagogicalRationale: z.string().min(1, 'Pedagogical rationale is required').max(1000, 'Pedagogical rationale must be 1000 characters or fewer'),
  sourceText: z.string().min(1, 'Source text is required').max(10000, 'Source text must be 10000 characters or fewer'),
});

export type CaseGenerationInput = z.infer<typeof CaseGenerationInputSchema>;

export interface CaseGenerationInputError {
  field: string;
  message: string;
}
