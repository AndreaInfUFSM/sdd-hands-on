import { describe, it, expect } from 'vitest';
import { ClinicalCaseSchema } from './schema';

const validCase = {
  schemaVersion: '1.0.0',
  patientPresentation: 'A 45-year-old male presents with chest pain.',
  clinicalHistory: 'History of hypertension and diabetes.',
  examinationFindings: 'Blood pressure 160/100, heart rate 92.',
  investigationResults: 'ECG shows ST elevation in leads II, III, aVF.',
  differentialDiagnosis: ['Acute MI', 'Pulmonary embolism', 'Aortic dissection'],
  managementPlan: 'Aspirin 325mg, heparin, cardiology consult.',
  provenance: {
    learningObjective: 'Identify acute inferior STEMI.',
    pedagogicalRationale: 'Common emergency presentation.',
    sourceText: 'AHA/ACC Guidelines for STEMI management.',
    generatedAt: '2026-01-01T00:00:00Z',
  },
};

describe('ClinicalCaseSchema', () => {
  it('validates a well-formed case', () => {
    const result = ClinicalCaseSchema.safeParse(validCase);
    expect(result.success).toBe(true);
  });

  it('rejects case missing required fields', () => {
    const incomplete = { ...validCase, patientPresentation: undefined };
    const result = ClinicalCaseSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects case with invalid field types', () => {
    const invalid = { ...validCase, differentialDiagnosis: 'not an array' };
    const result = ClinicalCaseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates case with optional progression steps', () => {
    const withSteps = {
      ...validCase,
      progressionSteps: [
        {
          id: 'step-1',
          order: 0,
          title: 'History',
          prompt: 'What is the chief complaint?',
        },
      ],
    };
    const result = ClinicalCaseSchema.safeParse(withSteps);
    expect(result.success).toBe(true);
  });

  it('rejects case without schemaVersion', () => {
    const { schemaVersion: _schemaVersion, ...noVersion } = validCase;
    void _schemaVersion;
    const result = ClinicalCaseSchema.safeParse(noVersion);
    expect(result.success).toBe(false);
  });

  it('rejects case with invalid provenance', () => {
    const invalid = { ...validCase, provenance: { learningObjective: 'x' } };
    const result = ClinicalCaseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
