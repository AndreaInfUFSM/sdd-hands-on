import { describe, it, expect, vi } from 'vitest';
import { advanceCase } from './progression-llm';
import { ClinicalCase } from './schema';
import { AIResponse } from '../ai/types';

function makeCase(): ClinicalCase {
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
        prompt: 'Chief complaint?',
        expectedResponses: [
          { pattern: 'chest pain', nextStepId: 'step-2' },
        ],
      },
      {
        id: 'step-2',
        order: 1,
        title: 'Exam',
        prompt: 'Exam findings?',
      },
    ],
  };
}

describe('advanceCase', () => {
  it('uses deterministic resolution when no current step', async () => {
    const llmCall = vi.fn();
    const result = await advanceCase(
      { caseData: makeCase(), currentStepId: null, studentResponse: '' },
      llmCall,
    );
    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-1');
    expect(llmCall).not.toHaveBeenCalled();
  });

  it('uses deterministic resolution when expected response matches', async () => {
    const llmCall = vi.fn();
    const result = await advanceCase(
      { caseData: makeCase(), currentStepId: 'step-1', studentResponse: 'chest pain' },
      llmCall,
    );
    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-2');
    expect(llmCall).not.toHaveBeenCalled();
  });

  it('invokes LLM fallback when no deterministic rule matches', async () => {
    const llmCall = vi.fn().mockResolvedValue({
      text: JSON.stringify({ nextStepId: 'step-2', response: 'Continuing case.' }),
    } as AIResponse);

    const result = await advanceCase(
      { caseData: makeCase(), currentStepId: 'step-1', studentResponse: 'the sky is blue' },
      llmCall,
    );

    expect(result.type).toBe('llm-fallback');
    expect(result.nextStep?.id).toBe('step-2');
    expect(llmCall).toHaveBeenCalledTimes(1);
  });

  it('handles LLM returning invalid JSON gracefully', async () => {
    const llmCall = vi.fn().mockResolvedValue({
      text: 'not json',
    } as AIResponse);

    const result = await advanceCase(
      { caseData: makeCase(), currentStepId: 'step-1', studentResponse: 'random' },
      llmCall,
    );

    expect(result.type).toBe('llm-fallback');
    expect(result.nextStep).toBeNull();
  });

  it('handles LLM returning unknown step ID', async () => {
    const llmCall = vi.fn().mockResolvedValue({
      text: JSON.stringify({ nextStepId: 'nonexistent', response: 'OK' }),
    } as AIResponse);

    const result = await advanceCase(
      { caseData: makeCase(), currentStepId: 'step-1', studentResponse: 'random' },
      llmCall,
    );

    expect(result.type).toBe('llm-fallback');
    expect(result.nextStep).toBeNull();
  });
});