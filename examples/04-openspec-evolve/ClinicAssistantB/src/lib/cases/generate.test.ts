import { describe, it, expect } from 'vitest';
import { buildCaseGenerationPrompt } from './prompt';
import { extractCaseFromLLMResponse } from './extraction';
import { generateClinicalCase } from './generate';
import { AIRequest, AIResponse } from '../ai/types';

const validInput = {
  topic: 'Acute Coronary Syndrome',
  learningObjective: 'Identify the differential diagnosis for chest pain.',
  pedagogicalRationale: 'ACS is a high-yield topic for medical students.',
  sourceText: 'AHA/ACC Guidelines for STEMI management 2024. Aspirin 325mg, heparin.',
};

const validGeneratedCase = {
  schemaVersion: '1.0.0',
  patientPresentation: '45yo male with chest pain',
  clinicalHistory: 'HTN, DM',
  examinationFindings: 'BP 160/100',
  investigationResults: 'ECG ST elevation II, III, aVF',
  differentialDiagnosis: ['STEMI', 'PE'],
  managementPlan: 'Aspirin, heparin, cath lab',
  provenance: {
    learningObjective: 'unused',
    pedagogicalRationale: 'unused',
    sourceText: 'unused',
    generatedAt: '2026-01-01T00:00:00Z',
  },
};

function fakeGenerator(calls: { prompt: string; role: string }[]): ClinicalGenerator {
  return {
    async generate(request) {
      calls.push({ prompt: request.prompt, role: request.role });
      return { text: JSON.stringify(validGeneratedCase), providerId: 'mock', modelId: 'mock-model' };
    },
  };
}

type ClinicalGenerator = {
  generate(request: AIRequest, modelId: string): Promise<AIResponse>;
};

describe('buildCaseGenerationPrompt', () => {
  it('includes all four inputs verbatim in the prompt', () => {
    const { prompt, role, responseFormat } = buildCaseGenerationPrompt(validInput);
    expect(prompt).toContain(validInput.topic);
    expect(prompt).toContain(validInput.learningObjective);
    expect(prompt).toContain(validInput.pedagogicalRationale);
    expect(prompt).toContain(validInput.sourceText);
    expect(role).toBe('MODEL_ROLE_EDUCATIONAL');
    expect(responseFormat).toBe('json');
  });

  it('includes source text verbatim', () => {
    const { prompt } = buildCaseGenerationPrompt(validInput);
    expect(prompt).toContain('AHA/ACC Guidelines for STEMI management 2024. Aspirin 325mg, heparin.');
  });
});

describe('extractCaseFromLLMResponse', () => {
  it('returns validated case for conforming response', () => {
    const result = extractCaseFromLLMResponse(JSON.stringify(validGeneratedCase));
    expect(result.success).toBe(true);
  });

  it('reports errors for malformed JSON', () => {
    const result = extractCaseFromLLMResponse('not json');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('reports errors for schema-invalid response', () => {
    const invalid = JSON.stringify({ foo: 'bar' });
    const result = extractCaseFromLLMResponse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('generateClinicalCase', () => {
  it('returns validated case with provenance on first attempt', async () => {
    const calls: { prompt: string; role: string }[] = [];
    const generationFn = (req: AIRequest) => fakeGenerator(calls).generate(req, 'test-model');

    const result = await generateClinicalCase(validInput, fakeGenerator(calls), generationFn);

    expect(result.case.patientPresentation).toBe('45yo male with chest pain');
    expect(result.case.provenance.learningObjective).toBe(validInput.learningObjective);
    expect(result.case.provenance.pedagogicalRationale).toBe(validInput.pedagogicalRationale);
    expect(result.case.provenance.sourceText).toBe(validInput.sourceText);
    expect(calls.length).toBe(1);
  });

  it('retries once when first response is invalid', async () => {
    const calls: { prompt: string }[] = [];
    let attemptCount = 0;
    const generationFn = async (req: AIRequest): Promise<AIResponse> => {
      calls.push({ prompt: req.prompt });
      attemptCount += 1;
      if (attemptCount === 1) {
        return { text: 'not valid json', providerId: 'mock', modelId: 'mock-model' };
      }
      return { text: JSON.stringify(validGeneratedCase), providerId: 'mock', modelId: 'mock-model' };
    };

    const result = await generateClinicalCase(validInput, {} as ClinicalGenerator, generationFn);
    expect(result.case.patientPresentation).toBe('45yo male with chest pain');
    expect(calls.length).toBe(2);
  });

  it('throws when both attempts are invalid', async () => {
    const generationFn = async (): Promise<AIResponse> => {
      return { text: 'not valid json', providerId: 'mock', modelId: 'mock-model' };
    };

    await expect(generateClinicalCase(validInput, {} as ClinicalGenerator, generationFn)).rejects.toThrow(
      /Failed to generate valid case/,
    );
  });
});
