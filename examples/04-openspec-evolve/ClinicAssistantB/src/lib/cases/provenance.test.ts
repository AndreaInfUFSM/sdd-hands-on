import { describe, it, expect } from 'vitest';
import { getProvenance, isProvenancePresent, validateProvenanceImmutable } from './provenance';
import { ClinicalCase } from './schema';

const validProvenance = {
  learningObjective: 'Identify acute inferior STEMI.',
  pedagogicalRationale: 'Common emergency presentation.',
  sourceText: 'AHA/ACC Guidelines for STEMI management.',
  generatedAt: '2026-01-01T00:00:00Z',
};

function makeCase(overrides?: Partial<ClinicalCase>): ClinicalCase {
  return {
    schemaVersion: '1.0.0',
    patientPresentation: '45yo male',
    clinicalHistory: 'HTN',
    examinationFindings: 'BP 160/100',
    investigationResults: 'ECG ST elevation',
    differentialDiagnosis: ['STEMI'],
    managementPlan: 'Aspirin',
    provenance: validProvenance,
    ...overrides,
  };
}

describe('getProvenance', () => {
  it('returns all provenance fields', () => {
    const result = getProvenance(makeCase());
    expect(result.learningObjective).toBe(validProvenance.learningObjective);
    expect(result.pedagogicalRationale).toBe(validProvenance.pedagogicalRationale);
    expect(result.sourceText).toBe(validProvenance.sourceText);
    expect(result.generatedAt).toBe(validProvenance.generatedAt);
  });
});

describe('isProvenancePresent', () => {
  it('returns true when all provenance fields are present', () => {
    expect(isProvenancePresent(makeCase())).toBe(true);
  });

  it('returns false when learning objective is missing', () => {
    expect(isProvenancePresent(makeCase({ provenance: { ...validProvenance, learningObjective: '' } }))).toBe(false);
  });

  it('returns false when source text is missing', () => {
    expect(isProvenancePresent(makeCase({ provenance: { ...validProvenance, sourceText: '' } }))).toBe(false);
  });
});

describe('validateProvenanceImmutable', () => {
  it('reports immutable when no fields changed', () => {
    const caseData = makeCase();
    const result = validateProvenanceImmutable(caseData, caseData);
    expect(result.immutable).toBe(true);
    expect(result.changedFields).toHaveLength(0);
  });

  it('detects changed learning objective', () => {
    const original = makeCase();
    const modified = makeCase({
      provenance: { ...validProvenance, learningObjective: 'Changed LO' },
    });
    const result = validateProvenanceImmutable(original, modified);
    expect(result.immutable).toBe(false);
    expect(result.changedFields).toContain('learningObjective');
  });

  it('detects changed source text', () => {
    const original = makeCase();
    const modified = makeCase({
      provenance: { ...validProvenance, sourceText: 'Changed source' },
    });
    const result = validateProvenanceImmutable(original, modified);
    expect(result.immutable).toBe(false);
    expect(result.changedFields).toContain('sourceText');
  });
});