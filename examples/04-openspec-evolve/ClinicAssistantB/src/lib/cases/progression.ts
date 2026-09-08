import { ClinicalCase, ProgressionStep } from './schema';

export interface ProgressionResult {
  type: 'deterministic' | 'fallback';
  nextStep: ProgressionStep | null;
  message: string;
}

export function resolveNextStep(
  caseData: ClinicalCase,
  currentStepId: string | null,
  studentResponse: string,
): ProgressionResult {
  const steps = caseData.progressionSteps;
  if (!steps || steps.length === 0) {
    return {
      type: 'fallback',
      nextStep: null,
      message: 'No progression steps defined.',
    };
  }

  if (!currentStepId) {
    const orderedSteps = [...steps].sort((a, b) => a.order - b.order);
    return {
      type: 'deterministic',
      nextStep: orderedSteps[0],
      message: `Started: ${orderedSteps[0].title}`,
    };
  }

  const currentStep = steps.find((s) => s.id === currentStepId);
  if (!currentStep) {
    return {
      type: 'fallback',
      nextStep: null,
      message: `Unknown step: ${currentStepId}`,
    };
  }

  if (currentStep.branchConditions) {
    for (const branch of currentStep.branchConditions) {
      if (studentResponse.toLowerCase().includes(branch.match.toLowerCase())) {
        const nextStep = steps.find((s) => s.id === branch.nextStepId) ?? null;
        return {
          type: 'deterministic',
          nextStep,
          message: nextStep ? `Advanced to: ${nextStep.title}` : 'Case progression complete.',
        };
      }
    }
  }

  if (currentStep.expectedResponses) {
    for (const expected of currentStep.expectedResponses) {
      if (studentResponse.toLowerCase().includes(expected.pattern.toLowerCase())) {
        const nextStep = expected.nextStepId
          ? steps.find((s) => s.id === expected.nextStepId) ?? null
          : null;
        return {
          type: 'deterministic',
          nextStep,
          message: nextStep ? `Advanced to: ${nextStep.title}` : 'Case progression complete.',
        };
      }
    }
  }

  if (currentStep.branchConditions || currentStep.expectedResponses) {
    return {
      type: 'fallback',
      nextStep: null,
      message: 'No deterministic rule matched.',
    };
  }

  const orderedSteps = [...steps].sort((a, b) => a.order - b.order);
  const currentIndex = orderedSteps.findIndex((s) => s.id === currentStepId);
  if (currentIndex !== -1 && currentIndex + 1 < orderedSteps.length) {
    const nextStep = orderedSteps[currentIndex + 1];
    return {
      type: 'deterministic',
      nextStep,
      message: `Advanced to: ${nextStep.title}`,
    };
  }

  return {
    type: 'fallback',
    nextStep: null,
    message: 'No deterministic rule matched.',
  };
}