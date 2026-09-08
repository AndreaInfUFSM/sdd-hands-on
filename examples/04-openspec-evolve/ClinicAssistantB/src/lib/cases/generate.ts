import { AIRequest, AIResponse } from '../ai/types';
import { CaseGenerationInput } from './inputs';
import { buildCaseGenerationPrompt } from './prompt';
import { extractCaseFromAIResponse } from './extraction';
import { ClinicalCase } from './schema';

export interface ClinicalCaseGenerator {
  generate(request: AIRequest, modelId: string): Promise<AIResponse>;
}

const CORRECTION_SYSTEM_INSTRUCTION = `
The previous response did not conform to the required JSON structure. 
Please return ONLY valid JSON matching the exact schema requested. 
Do not include any text outside the JSON object.
`;

export async function generateClinicalCase(
  input: CaseGenerationInput,
  generator: ClinicalCaseGenerator,
  generationFn: (req: AIRequest) => Promise<AIResponse>,
): Promise<{ case: ClinicalCase; providerId: string; modelId: string }> {
  const { prompt, role, responseFormat, systemInstruction } = buildCaseGenerationPrompt(input);

  const firstAttempt = await generationFn({
    prompt,
    role,
    responseFormat,
    systemInstruction,
  });

  let extraction = extractCaseFromAIResponse(firstAttempt);

  const caseWithProvenance = (validated: ClinicalCase): ClinicalCase => {
    const provenance = {
      ...validated.provenance,
      learningObjective: input.learningObjective,
      pedagogicalRationale: input.pedagogicalRationale,
      sourceText: input.sourceText,
    };
    return { ...validated, provenance };
  };

  if (!extraction.success) {
    const retrySystem = `${systemInstruction}\n\n${CORRECTION_SYSTEM_INSTRUCTION}\n\nPrevious errors:\n${extraction.errors
      .map((e) => `- ${e.path}: ${e.message}`)
      .join('\n')}`;

    const secondAttempt = await generationFn({
      prompt,
      role,
      responseFormat,
      systemInstruction: retrySystem,
    });

    extraction = extractCaseFromAIResponse(secondAttempt);

    if (extraction.success) {
      return {
        case: caseWithProvenance(extraction.case),
        providerId: secondAttempt.providerId,
        modelId: secondAttempt.modelId,
      };
    }

    throw new Error(
      `Failed to generate valid case after retry: ${extraction.errors.map((e) => `${e.path}: ${e.message}`).join(', ')}`,
    );
  }

  return {
    case: caseWithProvenance(extraction.case),
    providerId: firstAttempt.providerId,
    modelId: firstAttempt.modelId,
  };
}
