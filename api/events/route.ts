// api/events/route.ts
import { supabase } from '@/lib/supabase';
import { getClubIdForManager } from '@/lib/club';

type Event = {
  id: string;
  name: string;
  start_date: string;
  end_date?: string | null;
  club_id: string;
};

export async function getEventsForManager(): Promise<Event[]> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Utente non autenticato');
    }

    const clubId = await getClubIdForManager(user.id);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('club_id', clubId)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('[getEventsForManager] Supabase error:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[getEventsForManager] Unexpected error:', err);
    return [];
  }
}
