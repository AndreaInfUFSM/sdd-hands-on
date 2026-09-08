import { NextResponse } from 'next/server';
import { validateCaseInput } from '@/lib/cases/validation';
import { buildCaseGenerationPrompt } from '@/lib/cases/prompt';
import { extractCaseFromAIResponse } from '@/lib/cases/extraction';
import { translateProviderError } from '@/lib/cases/translate-error';
import { getUserFacingErrorMessage } from '@/lib/cases/error-messages';
import { orchestrator } from '@/lib/ai/router';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = validateCaseInput(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid inputs', validationErrors: validation.errors },
        { status: 400 },
      );
    }

    const input = validation.data;
    const { prompt, role, responseFormat, systemInstruction } = buildCaseGenerationPrompt(input);

    let firstAttempt;
    try {
      firstAttempt = await orchestrator.processRequest({
        prompt,
        role,
        responseFormat,
        systemInstruction,
      });
    } catch (error: unknown) {
      const translated = translateProviderError(error);
      return NextResponse.json(
        {
          error: getUserFacingErrorMessage(translated),
          category: translated.category,
        },
        { status: 502 },
      );
    }

    let extraction = extractCaseFromAIResponse(firstAttempt);

    if (!extraction.success) {
      const correctionInstruction = `${systemInstruction}\n\nThe previous response did not conform to the required JSON structure. Return ONLY valid JSON matching the exact structure requested. Previous errors:\n${extraction.errors
        .map((e) => `- ${e.path}: ${e.message}`)
        .join('\n')}`;

      let secondAttempt;
      try {
        secondAttempt = await orchestrator.processRequest({
          prompt,
          role,
          responseFormat,
          systemInstruction: correctionInstruction,
        });
      } catch (error: unknown) {
        const translated = translateProviderError(error);
        return NextResponse.json(
          {
            error: getUserFacingErrorMessage(translated),
            category: translated.category,
          },
          { status: 502 },
        );
      }

      extraction = extractCaseFromAIResponse(secondAttempt);
      if (!extraction.success) {
        return NextResponse.json(
          {
            error: getUserFacingErrorMessage({ category: 'invalid-output' }),
            category: 'invalid-output',
            details: extraction.errors,
          },
          { status: 422 },
        );
      }
    }

    const generatedCase = {
      ...extraction.case,
      provenance: {
        ...extraction.case.provenance,
        schemaVersion: extraction.case.schemaVersion,
        learningObjective: input.learningObjective,
        pedagogicalRationale: input.pedagogicalRationale,
        sourceText: input.sourceText,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json({ case: generatedCase, providerId: firstAttempt.providerId });
  } catch (error: unknown) {
    console.error('Case generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error generating case.' },
      { status: 500 },
    );
  }
}