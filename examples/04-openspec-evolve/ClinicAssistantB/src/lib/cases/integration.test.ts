import { describe, it, expect, vi } from 'vitest';
import { validateCaseInput } from './validation';
import { buildCaseGenerationPrompt } from './prompt';
import { generateClinicalCase } from './generate';
import { resolveNextStep } from './progression';
import { advanceCase } from './progression-llm';
import { isProvenancePresent } from './provenance';
import { ClinicalCaseSchema } from './schema';
import { AIResponse } from '../ai/types';

const structuredInput = {
  topic: 'Acute Coronary Syndrome',
  learningObjective: 'Identify the differential diagnosis for chest pain.',
  pedagogicalRationale: 'ACS is a high-yield topic for medical students.',
  sourceText: 'AHA/ACC Guidelines for STEMI management 2024.',
};

const validGeneratedCaseRaw = {
  schemaVersion: '1.0.0',
  patientPresentation: 'A 45-year-old male presents with chest pain radiating to left arm.',
  clinicalHistory: 'History of hypertension and type 2 diabetes.',
  examinationFindings: 'Blood pressure 160/100 mmHg, heart rate 92 bpm.',
  investigationResults: 'ECG shows ST elevation in leads II, III, aVF.',
  differentialDiagnosis: ['Acute inferior STEMI', 'Pulmonary embolism', 'Aortic dissection'],
  managementPlan: 'Aspirin 325mg, heparin drip, urgent cardiology consult.',
  provenance: {
    learningObjective: 'placeholder',
    pedagogicalRationale: 'placeholder',
    sourceText: 'placeholder',
    generatedAt: '2026-01-01T00:00:00Z',
  },
  progressionSteps: [
    {
      id: 'step-1',
      order: 0,
      title: 'Apresentação',
      prompt: 'Qual a principal queixa?',
      expectedResponses: [
        { pattern: 'dor no peito', nextStepId: 'step-2' },
        { pattern: 'chest pain', nextStepId: 'step-2' },
      ],
    },
    {
      id: 'step-2',
      order: 1,
      title: 'Exame físico',
      prompt: 'Descreva os achados do exame.',
    },
  ],
};

const input = validateCaseInput(structuredInput);

describe('10.1 Full case generation flow', () => {
  it('accepts structured inputs through validation', () => {
    expect(input.success).toBe(true);
    if (input.success) {
      expect(input.data.topic).toBe('Acute Coronary Syndrome');
    }
  });

  it('builds an LLM request from validated inputs', () => {
    if (!input.success) throw new Error('Input should be valid');
    const { prompt, role, responseFormat } = buildCaseGenerationPrompt(input.data);
    expect(prompt).toContain(input.data.topic);
    expect(prompt).toContain(input.data.learningObjective);
    expect(prompt).toContain(input.data.sourceText);
    expect(role).toBe('MODEL_ROLE_EDUCATIONAL');
    expect(responseFormat).toBe('json');
  });

  it('generates, validates, and enriches a case with provenance', async () => {
    if (!input.success) throw new Error('Input should be valid');
    const generationFn = async (): Promise<AIResponse> => ({
      text: JSON.stringify(validGeneratedCaseRaw),
      providerId: 'gemini',
      modelId: 'gemini-3.5-flash',
    });

    const result = await generateClinicalCase(input.data, {} as never, generationFn);

    expect(ClinicalCaseSchema.safeParse(result.case).success).toBe(true);
    expect(result.case.provenance.learningObjective).toBe(structuredInput.learningObjective);
    expect(result.case.provenance.sourceText).toBe(structuredInput.sourceText);
    expect(result.case.progressionSteps).toHaveLength(2);
    expect(isProvenancePresent(result.case)).toBe(true);
  });

  it('generates a structured object with provenance that survives schema validation', async () => {
    if (!input.success) throw new Error('Input should be valid');
    const generationFn = async (): Promise<AIResponse> => ({
      text: JSON.stringify(validGeneratedCaseRaw),
      providerId: 'gemini',
      modelId: 'gemini-3.5-flash',
    });

    const result = await generateClinicalCase(input.data, {} as never, generationFn);

    expect(ClinicalCaseSchema.safeParse(result.case).success).toBe(true);
    expect(result.case.provenance.learningObjective).toBe(structuredInput.learningObjective);
    expect(result.case.provenance.sourceText).toBe(structuredInput.sourceText);
    expect(result.case.progressionSteps).toHaveLength(2);
    expect(isProvenancePresent(result.case)).toBe(true);
  });

  it('persists the validated case object with its schema version', async () => {
    if (!input.success) throw new Error('Input should be valid');
    expect(validGeneratedCaseRaw.schemaVersion).toBe('1.0.0');
    expect(ClinicalCaseSchema.parse(validGeneratedCaseRaw).schemaVersion).toBe('1.0.0');
  });
});

describe('10.2 Deterministic progression flow', () => {
  it('advances a student without an LLM call when a rule matches', async () => {
    if (!input.success) throw new Error('Input should be valid');
    const generationFn = async (): Promise<AIResponse> => ({
      text: JSON.stringify(validGeneratedCaseRaw),
      providerId: 'gemini',
      modelId: 'gemini-3.5-flash',
    });

    const { case: generated } = await generateClinicalCase(input.data, {} as never, generationFn);
    const llmCall = vi.fn();

    const step1 = resolveNextStep(generated, null, '');
    expect(step1.type).toBe('deterministic');
    expect(step1.nextStep?.id).toBe('step-1');

    const result = await advanceCase(
      { caseData: generated, currentStepId: 'step-1', studentResponse: 'dor no peito' },
      llmCall,
    );

    expect(result.type).toBe('deterministic');
    expect(result.nextStep?.id).toBe('step-2');
    expect(llmCall).not.toHaveBeenCalled();
  });
});

describe('10.3 LLM fallback flow', () => {
  it('invokes the LLM only when no deterministic rule matches', async () => {
    if (!input.success) throw new Error('Input should be valid');
    const generationFn = async (): Promise<AIResponse> => ({
      text: JSON.stringify(validGeneratedCaseRaw),
      providerId: 'gemini',
      modelId: 'gemini-3.5-flash',
    });

    const { case: generated } = await generateClinicalCase(input.data, {} as never, generationFn);
    const llmCall = vi.fn().mockResolvedValue({
      text: JSON.stringify({ nextStepId: 'step-2', response: 'Continuando o caso.' }),
      providerId: 'gemini',
      modelId: 'gemini-3.5-flash',
    } as AIResponse);

    const result = await advanceCase(
      { caseData: generated, currentStepId: 'step-1', studentResponse: 'o ceu esta azul' },
      llmCall,
    );

    expect(result.type).toBe('llm-fallback');
    expect(llmCall).toHaveBeenCalledTimes(1);
    expect(result.nextStep).not.toBeNull();
  });
});