// api/validate-ticket/route.js

export async function POST(request) {
    try {
      const { qr } = await request.json();
  
      if (!qr) {
        return new Response(JSON.stringify({ valid: false, error: "Missing QR data" }), { status: 400 });
      }
  
      const supabase = await createServerSupabase();
  
      // Cerca il ticket con il campo qr_data
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select('id')
        .eq('qr_data', qr)
        .single();
  
      if (error || !ticket) {
        return new Response(JSON.stringify({ valid: false }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ valid: true, ticketId: ticket.id }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ valid: false, error: "Internal Server Error" }), { status: 500 });
    }
  }
  