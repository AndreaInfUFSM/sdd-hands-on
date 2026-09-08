import { createClient } from '../supabase/client';
import { ClinicalCase } from './schema';

interface ClinicalCaseRow {
  id: string;
  user_id: string;
  case_data: ClinicalCase;
  schema_version: string;
  created_at: string;
}

export async function saveClinicalCase(
  userId: string,
  caseData: ClinicalCase,
): Promise<ClinicalCaseRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('clinical_cases')
    .insert({
      user_id: userId,
      case_data: caseData,
      schema_version: caseData.schemaVersion,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save clinical case: ${error.message}`);
  }

  return data as ClinicalCaseRow;
}

export async function getClinicalCase(
  caseId: string,
): Promise<ClinicalCaseRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('clinical_cases')
    .select()
    .eq('id', caseId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to retrieve clinical case: ${error.message}`);
  }

  return (data as ClinicalCaseRow) ?? null;
}

export async function listClinicalCases(
  userId: string,
): Promise<ClinicalCaseRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('clinical_cases')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list clinical cases: ${error.message}`);
  }

  return (data as ClinicalCaseRow[]) ?? [];
}