// lib/tickets.ts
import { supabase } from './supabase';

export async function validateTicket(
  qr: string,
  eventId: string
): Promise<{ valid: boolean; ticketId?: string; reason?: string }> {
  // 1. Cerca il ticket corrispondente per QR
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, scanned, event_id')
    .eq('qr_data', qr)
    .single();

  if (error || !ticket) {
    return { valid: false, reason: 'Not Found' };
  }

  // 2. Verifica se appartiene all'evento giusto
  if (ticket.event_id !== eventId) {
    return { valid: false, reason: 'Wrong Event' };
  }

  // 3. Verifica se è già stato scansionato
  if (ticket.scanned) {
    return { valid: false, reason: 'Already Scanned' };
  }

  // 4. Aggiorna: scanned true e timestamp
  const { error: updateError } = await supabase
    .from('tickets')
    .update({
      scanned: true,
      scanned_at: new Date().toISOString(),
    })
    .eq('id', ticket.id);

  if (updateError) {
    return { valid: false, reason: 'update_failed' };
  }

  return { valid: true, ticketId: ticket.id };
}
