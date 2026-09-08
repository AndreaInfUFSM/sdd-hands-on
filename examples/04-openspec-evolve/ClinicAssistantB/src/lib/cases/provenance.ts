import { ClinicalCase } from './schema';

export interface ProvenanceDisplay {
  learningObjective: string;
  pedagogicalRationale: string;
  sourceText: string;
  generatedAt: string;
}

export function getProvenance(caseData: ClinicalCase): ProvenanceDisplay {
  return {
    learningObjective: caseData.provenance.learningObjective,
    pedagogicalRationale: caseData.provenance.pedagogicalRationale,
    sourceText: caseData.provenance.sourceText,
    generatedAt: caseData.provenance.generatedAt,
  };
}

export function isProvenancePresent(caseData: ClinicalCase): boolean {
  return !!(
    caseData.provenance?.learningObjective &&
    caseData.provenance?.pedagogicalRationale &&
    caseData.provenance?.sourceText &&
    caseData.provenance?.generatedAt
  );
}

export function validateProvenanceImmutable(
  original: ClinicalCase,
  modified: ClinicalCase,
): { immutable: boolean; changedFields: string[] } {
  const changedFields: string[] = [];

  if (original.provenance.learningObjective !== modified.provenance.learningObjective) {
    changedFields.push('learningObjective');
  }
  if (original.provenance.pedagogicalRationale !== modified.provenance.pedagogicalRationale) {
    changedFields.push('pedagogicalRationale');
  }
  if (original.provenance.sourceText !== modified.provenance.sourceText) {
    changedFields.push('sourceText');
  }
  if (original.provenance.generatedAt !== modified.provenance.generatedAt) {
    changedFields.push('generatedAt');
  }

  return {
    immutable: changedFields.length === 0,
    changedFields,
  };
}