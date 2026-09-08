'use client';

import type { ClinicalCase } from '@/lib/cases/schema';

interface CaseViewProps {
  caseData: ClinicalCase;
}

const sectionLabels: Array<{ key: keyof ClinicalCase; label: string }> = [
  { key: 'patientPresentation', label: 'Apresentação do paciente' },
  { key: 'clinicalHistory', label: 'História clínica' },
  { key: 'examinationFindings', label: 'Achados do exame físico' },
  { key: 'investigationResults', label: 'Resultados de investigação' },
  { key: 'differentialDiagnosis', label: 'Diagnóstico diferencial' },
  { key: 'managementPlan', label: 'Plano de manejo' },
];

function renderSectionValue(key: keyof ClinicalCase, value: unknown): React.ReactNode {
  if (key === 'differentialDiagnosis' && Array.isArray(value)) {
    return (
      <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {value.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }
  return String(value ?? '');
}

export function CaseView({ caseData }: CaseViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {sectionLabels.map(({ key, label }) => (
        <div key={key}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-semantic-text-textdark)', marginBottom: 'var(--spacing-sm)' }}>
            {label}
          </h3>
          <div style={{ lineHeight: 1.6, color: 'var(--color-semantic-text-textdark)', whiteSpace: 'pre-wrap' }}>
            {renderSectionValue(key, caseData[key])}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-semantic-backgroundcolor-backgrounddimmer)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-inset-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-semantic-text-textdark)', margin: 0 }}>
          Proveniência do caso
        </h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-semantic-text-textlight)', lineHeight: 1.5 }}>
          <div><strong>Objetivo de aprendizagem:</strong> {caseData.provenance.learningObjective}</div>
          <div><strong>Justificativa pedagógica:</strong> {caseData.provenance.pedagogicalRationale}</div>
          <div><strong>Fonte médica:</strong> {caseData.provenance.sourceText}</div>
          <div><strong>Gerado em:</strong> {new Date(caseData.provenance.generatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}