// lib/club.ts
import { supabase } from './supabase';

export async function getClubIdForManager(userId: string) {
  const { data, error } = await supabase
    .from('clubs')
    .select('id')
    .eq('manager_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Nessun club trovato per questo manager');
  }

  return data.id;
}
