import { ClinicalCase, ProgressionStep } from './schema';
import { resolveNextStep } from './progression';
import { AIRequest, AIResponse } from '../ai/types';

export interface ProgressionContext {
  caseData: ClinicalCase;
  currentStepId: string | null;
  studentResponse: string;
}

export interface ProgressionOutcome {
  type: 'deterministic' | 'llm-fallback';
  nextStep: ProgressionStep | null;
  message: string;
}

export async function advanceCase(
  context: ProgressionContext,
  llmCall: (request: AIRequest) => Promise<AIResponse>,
): Promise<ProgressionOutcome> {
  const result = resolveNextStep(
    context.caseData,
    context.currentStepId,
    context.studentResponse,
  );

  if (result.type === 'deterministic') {
    return {
      type: 'deterministic',
      nextStep: result.nextStep,
      message: result.message,
    };
  }

  const stepsSummary = context.caseData.progressionSteps
    ?.map((s) => `- ${s.id}: ${s.title}`)
    .join('\n') ?? 'None';

  const prompt = `A student is interacting with a clinical case.
Case presentation: ${context.caseData.patientPresentation}
Current step: ${context.currentStepId ?? 'None'}
Student response: "${context.studentResponse}"

Existing progression steps:
${stepsSummary}

Based on the student's response, determine the next appropriate step. Return a JSON object:
{
  "nextStepId": "step-id or null if case is complete",
  "response": "A message to show the student"
}`;

  const aiResponse = await llmCall({
    prompt,
    role: 'MODEL_ROLE_EDUCATIONAL',
    responseFormat: 'json',
    systemInstruction: 'You are a medical education assistant managing case progression.',
  });

  let parsed: { nextStepId?: string; response?: string };
  try {
    parsed = JSON.parse(aiResponse.text);
  } catch {
    return {
      type: 'llm-fallback',
      nextStep: null,
      message: 'Unable to process the response. Please try again.',
    };
  }

  const nextStep = parsed.nextStepId
    ? context.caseData.progressionSteps?.find((s) => s.id === parsed.nextStepId) ?? null
    : null;

  return {
    type: 'llm-fallback',
    nextStep,
    message: parsed.response ?? 'Response processed.',
  };
}