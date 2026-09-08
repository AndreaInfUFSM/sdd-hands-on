/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClinicalCase } from './schema';

const validCase: ClinicalCase = {
  schemaVersion: '1.0.0',
  patientPresentation: '45yo male',
  clinicalHistory: 'HTN',
  examinationFindings: 'BP 160/100',
  investigationResults: 'ECG ST elevation',
  differentialDiagnosis: ['STEMI'],
  managementPlan: 'Aspirin',
  provenance: {
    learningObjective: 'Identify STEMI',
    pedagogicalRationale: 'Common emergency',
    sourceText: 'AHA/ACC Guidelines',
    generatedAt: '2026-01-01T00:00:00Z',
  },
};

const storeHolder: { rows: Array<Record<string, unknown>> } = { rows: [] };

vi.mock('../supabase/client', () => {
  function buildApi() {
    const state: Record<string, any> = {};
    const api: any = {};

    api.select = () => {
      state.mode = 'select';
      return api;
    };

    api.insert = (row: Record<string, unknown>) => {
      const id = 'mock-uuid-' + storeHolder.rows.length;
      const inserted = { id, ...row, created_at: new Date().toISOString() };
      storeHolder.rows.push(inserted);
      state.mode = 'insert';
      state.inserted = inserted;
      return {
        select: () => ({
          single: async () => ({ data: inserted, error: null }),
        }),
      };
    };

    api.eq = (col: string, val: string) => {
      state.filter = { col, val };
      return api;
    };

    api.order = (_col: string, _opts?: unknown) => {
      void _col;
      void _opts;
      state.ordered = true;
      return api;
    };

    api.single = async () => {
      if (state.filter) {
        const found = storeHolder.rows.find(
          (r: any) =>
            r[state.filter.col] === state.filter.val ||
            r.id === state.filter.val ||
            r.user_id === state.filter.val,
        );
        return found
          ? { data: found, error: null }
          : { data: null, error: { code: 'PGRST116', message: 'Not found' } };
      }
      return { data: null, error: null };
    };

    api.then = (resolve: (v: any) => void) => {
      let rows = storeHolder.rows;
      if (state.filter) {
        rows = storeHolder.rows.filter((r: any) => r[state.filter.col] === state.filter.val);
      }
      resolve({ data: rows, error: null });
    };

    return api;
  }

  return {
    createClient: () => ({
      from: () => buildApi(),
    }),
  };
});

const { saveClinicalCase, getClinicalCase, listClinicalCases } = await import('./persistence');

beforeEach(() => {
  storeHolder.rows = [];
});

describe('saveClinicalCase', () => {
  it('saves a clinical case and returns it with id', async () => {
    const result = await saveClinicalCase('user-1', validCase);
    expect(result.id).toBeDefined();
    expect(result.case_data.schemaVersion).toBe('1.0.0');
    expect(result.user_id).toBe('user-1');
  });
});

describe('getClinicalCase', () => {
  it('retrieves a saved clinical case by id', async () => {
    const saved = await saveClinicalCase('user-1', validCase);
    const retrieved = await getClinicalCase(saved.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.case_data.patientPresentation).toBe('45yo male');
  });

  it('returns null for non-existent case', async () => {
    const result = await getClinicalCase('non-existent');
    expect(result).toBeNull();
  });
});

describe('listClinicalCases', () => {
  it('returns cases for the specified user', async () => {
    await saveClinicalCase('user-list', validCase);
    await saveClinicalCase('user-list', validCase);
    const cases = await listClinicalCases('user-list');
    expect(cases).toHaveLength(2);
    cases.forEach((c) => expect(c.user_id).toBe('user-list'));
  });
});