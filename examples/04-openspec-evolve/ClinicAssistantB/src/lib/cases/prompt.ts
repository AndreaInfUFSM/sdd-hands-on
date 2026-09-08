import { CaseGenerationInput } from './inputs';
import { ModelRole } from '../ai/types';

export function buildCaseGenerationPrompt(input: CaseGenerationInput): {
  prompt: string;
  role: ModelRole;
  responseFormat: 'json';
  systemInstruction: string;
} {
  const prompt = `
You are a clinical reasoning assistant for medical education. Generate a structured clinical case based on the inputs below.

## Topic
${input.topic}

## Learning Objective
${input.learningObjective}

## Pedagogical Rationale
${input.pedagogicalRationale}

## Trusted Medical Source Text
${input.sourceText}

Using ONLY the source text above as the clinical basis (do not invent facts outside the provided source), generate a complete clinical case. The case must help learners achieve the stated learning objective.

Return a JSON object with exactly this structure:
{
  "patientPresentation": string,
  "clinicalHistory": string,
  "examinationFindings": string,
  "investigationResults": string,
  "differentialDiagnosis": string[],
  "managementPlan": string
}
`;

  return {
    prompt,
    role: 'MODEL_ROLE_EDUCATIONAL',
    responseFormat: 'json',
    systemInstruction: 'Você é o MedHUSM, um assistente de raciocínio clínico para educação médica. Gere casos clínicos estruturados e fundamentados nas fontes fornecidas. Responda em JSON válido.',
  };
}
