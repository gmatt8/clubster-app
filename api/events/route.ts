// api/events/route.ts
import { supabase } from '@/lib/supabase';

export async function getEventsForManager() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Utente non autenticato");
  }

  const clubId = user.user_metadata?.club_id; // Assicurati che esista
  if (!clubId) {
    throw new Error("club_id non trovato nei metadata utente");
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('club_id', clubId)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Errore nel recupero eventi:', error);
    throw error;
  }

  return data;
}
