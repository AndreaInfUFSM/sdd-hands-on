import { describe, it, expect } from 'vitest';
import { resolveNextStep } from './progression';
import { ClinicalCase } from './schema';

function makeCase(overrides?: Partial<ClinicalCase>): ClinicalCase {
  return {
    schemaVersion: '1.0.0',
    patientPresentation: 'Test patient',
    clinicalHistory: 'Test history',
    examinationFindings: 'Test findings',
    investigationResults: 'Test results',
    differentialDiagnosis: ['Test DDx'],
    managementPlan: 'Test plan',
    provenance: {
      learningObjective: 'LO',
      pedagogicalRationale: 'Rationale',
      sourceText: 'Source',
      generatedAt: '2026-01-01T00:00:00Z',
    },
    progressionSteps: [
      {
        id: 'step-1',
        order: 0,
        title: 'History',
        prompt: 'What is the chief complaint?',
        expectedResponses: [
          { pattern: 'chest pain', nextStepId: 'step-2' },
          { pattern: 'headache', nextStepId: 'step-3' },
        ],
      },
      {
        id: 'step-2',
        order: 1,
        title: 'Examination',
        prompt: 'Perform cardiac exam.',
        branchConditions: [
          { match: 'abnormal', nextStepId: 'step-4' },
        ],
      },
      {
        id: 'step-3',
        order: 2,
        title: 'Neuro Exam',
        prompt: 'Perform neurological exam.',
      },
      {
        id: 'step-4',
        order: 3,
        title: 'Investigations',
        prompt: 'Order ECG and labs.',
      },
    ],
    ...overrides,
  };
}

describe('resolveNextStep', () => {
  it('returns first step when no current step is provided', () => {
    const caseData = makeCase();
    const result = resolveNextStep(caseData, null, '');
    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-1');
  });

  it('matches expected response pattern and advances', () => {
    const caseData = makeCase();
    const result = resolveNextStep(caseData, 'step-1', 'The patient has chest pain');
    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-2');
  });

  it('matches branch condition and advances to branch target', () => {
    const caseData = makeCase();
    const result = resolveNextStep(caseData, 'step-2', 'I found abnormal heart sounds');
    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-4');
  });

  it('returns fallback when no rule matches', () => {
    const caseData = makeCase();
    const result = resolveNextStep(caseData, 'step-1', 'The sky is blue');
    expect(result.type).toBe('fallback');
    expect(result.nextStep).toBeNull();
  });

  it('returns null nextStep at end of sequence', () => {
    const caseData = makeCase();
    const result = resolveNextStep(caseData, 'step-4', 'Done');
    expect(result.type).toBe('fallback');
    expect(result.nextStep).toBeNull();
  });

  it('handles case with no progression steps', () => {
    const caseData = makeCase({ progressionSteps: undefined });
    const result = resolveNextStep(caseData, null, '');
    expect(result.type).toBe('fallback');
  });
});