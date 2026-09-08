import { z } from 'zod';

const ProgressionStepSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
  title: z.string(),
  prompt: z.string(),
  expectedResponses: z.array(z.object({
    pattern: z.string(),
    nextStepId: z.string().optional(),
  })).optional(),
  branchConditions: z.array(z.object({
    match: z.string(),
    nextStepId: z.string(),
  })).optional(),
});

const ProvenanceSchema = z.object({
  learningObjective: z.string(),
  pedagogicalRationale: z.string(),
  sourceText: z.string(),
  generatedAt: z.string(),
});

export const ClinicalCaseSchema = z.object({
  schemaVersion: z.string(),
  patientPresentation: z.string(),
  clinicalHistory: z.string(),
  examinationFindings: z.string(),
  investigationResults: z.string(),
  differentialDiagnosis: z.array(z.string()),
  managementPlan: z.string(),
  progressionSteps: z.array(ProgressionStepSchema).optional(),
  provenance: ProvenanceSchema,
});

export type ClinicalCase = z.infer<typeof ClinicalCaseSchema>;
export type ProgressionStep = z.infer<typeof ProgressionStepSchema>;
export type Provenance = z.infer<typeof ProvenanceSchema>;
