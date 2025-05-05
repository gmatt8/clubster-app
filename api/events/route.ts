// api/events/route.ts
import { supabase } from '@/lib/supabase';
import { getClubIdForManager } from '@/lib/club';

export async function getEventsForManager() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Utente non autenticato");
  }

  const clubId = await getClubIdForManager(user.id); // ← usa il DB, non metadata


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
