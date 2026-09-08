'use client';

import { useState } from 'react';
import { validateCaseInput } from '@/lib/cases/validation';
import type { CaseGenerationInputError } from '@/lib/cases/inputs';

interface StructuredCaseFormProps {
  onSubmit: (input: { topic: string; learningObjective: string; pedagogicalRationale: string; sourceText: string }) => Promise<void>;
  disabled?: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  topic: 'Tema',
  learningObjective: 'Objetivo de aprendizagem',
  pedagogicalRationale: 'Justificativa pedagógica',
  sourceText: 'Fonte de referência (texto)',
};

export function StructuredCaseForm({ onSubmit, disabled }: StructuredCaseFormProps) {
  const [topic, setTopic] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [pedagogicalRationale, setPedagogicalRationale] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [errors, setErrors] = useState<CaseGenerationInputError[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = {
    width: '100%',
    background: 'var(--color-semantic-backgroundcolor-backgrounddefault)',
    border: 'none',
    borderRadius: '16px',
    padding: 'var(--spacing-ml) var(--spacing-md)',
    boxShadow: 'var(--shadow-inset-medium)',
    color: 'var(--color-semantic-text-textdark)',
    fontFamily: 'var(--typography-fontfamilies-mainsans)',
    outline: 'none',
    fontSize: '0.95rem',
  } as const;

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-semantic-text-textdark)',
    marginBottom: 'var(--spacing-sm)',
    display: 'block',
  } as const;

  const errorStyle = {
    fontSize: '0.8rem',
    color: 'var(--color-danger-600, #d64545)',
    marginTop: 'var(--spacing-sm)',
  } as const;

  const handleSubmit = async () => {
    const input = { topic, learningObjective, pedagogicalRationale, sourceText };
    const validation = validateCaseInput(input);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    setSubmitting(true);
    try {
      await onSubmit(input);
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: string) => errors.find((e) => e.field === field);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', width: '100%' }}>
      {([
        ['topic', topic, setTopic],
        ['learningObjective', learningObjective, setLearningObjective],
        ['pedagogicalRationale', pedagogicalRationale, setPedagogicalRationale],
      ] as const).map(([field, value, setter]) => (
        <div key={field}>
          <label style={labelStyle}>{FIELD_LABELS[field]}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={`Digite ${FIELD_LABELS[field].toLowerCase()}`}
            style={inputStyle}
            disabled={disabled || submitting}
          />
          {getFieldError(field) && <div style={errorStyle}>{getFieldError(field)!.message}</div>}
        </div>
      ))}

      <div>
        <label style={labelStyle}>{FIELD_LABELS.sourceText}</label>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Cole aqui o texto da fonte médica confiável (diretriz, guideline, artigo) que embasará o caso."
          rows={6}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--typography-fontfamilies-mainserif)', lineHeight: 1.6 }}
          disabled={disabled || submitting}
        />
        {getFieldError('sourceText') && <div style={errorStyle}>{getFieldError('sourceText')!.message}</div>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || submitting}
        className="neu-button"
        style={{
          border: 'none',
          borderRadius: '999px',
          padding: 'var(--spacing-ml) var(--spacing-lg)',
          cursor: submitting ? 'wait' : 'pointer',
          color: 'var(--color-semantic-text-textdark)',
          fontWeight: 600,
          fontFamily: 'var(--typography-fontfamilies-mainsans)',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? 'Gerando caso...' : 'Gerar caso clínico'}
      </button>
    </div>
  );
}