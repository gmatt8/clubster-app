// lib/tickets.ts
import { supabase } from './supabase';

export async function validateTicket(qr: string): Promise<{ valid: boolean; ticketId?: string }> {
  const { data, error } = await supabase
    .from('tickets')
    .select('id')
    .eq('qr_data', qr)
    .single();

  if (error || !data) {
    return { valid: false };
  }

  return { valid: true, ticketId: data.id };
}
