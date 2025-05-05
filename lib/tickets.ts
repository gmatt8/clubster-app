// lib/tickets.ts
import { supabase } from './supabase';

export async function validateTicket(
  qr: string,
  eventId: string
): Promise<{ valid: boolean; ticketId?: string }> {
  // 1. Cerca il ticket corrispondente per QR
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, scanned, event_id') // assicurati che event_id esista
    .eq('qr_data', qr)
    .single();

  if (error || !ticket) {
    return { valid: false };
  }

  // 2. Verifica se appartiene all'evento giusto
  if (ticket.event_id !== eventId) {
    return { valid: false };
  }

  // 3. Verifica se è già stato scansionato
  if (ticket.scanned) {
    return { valid: false };
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
    return { valid: false };
  }

  return { valid: true, ticketId: ticket.id };
}
