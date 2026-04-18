import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log("WhatsApp Webhook Payload Received")

    // 1. Verify this is a WhatsApp Message with an Image
    const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (!message || message.type !== 'image') {
      return new Response(JSON.stringify({ status: 'not an image' }), { headers: CORS_HEADERS })
    }

    const senderNumber = message.from
    const mediaId = message.image.id

    // 2. Find the pending member by WhatsApp number
    const { data: member, error: memberError } = await supabaseClient
      .from('members')
      .select('*')
      .eq('whatsapp_num', senderNumber)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .single()

    if (memberError || !member) {
      console.log("No pending member found for:", senderNumber)
      return new Response(JSON.stringify({ status: 'no member' }), { headers: CORS_HEADERS })
    }

    // 3. (Optional) Download Media from WhatsApp Cloud API
    // Note: You need WHATSAPP_ACCESS_TOKEN set in Supabase Secrets
    const waToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const mediaResponse = await fetch(`https://graph.facebook.com/v17.0/${mediaId}`, {
      headers: { 'Authorization': `Bearer ${waToken}` }
    })
    const mediaData = await mediaResponse.json()
    const imageBlob = await fetch(mediaData.url, {
      headers: { 'Authorization': `Bearer ${waToken}` }
    }).then(r => r.blob())

    // 4. Send to Gemini AI for OCR & Verification
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const imageBuffer = await imageBlob.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Verify if this is a payment receipt for Benny Gym. Extract: 1. Transaction ID, 2. Amount, 3. Date. Is it successful? Return JSON format only: { 'verified': true/false, 'amount': 2000, 'transaction_id': '...' }" },
            { inline_data: { mime_type: "image/jpeg", data: base64Image } }
          ]
        }]
      })
    })

    const aiResult = await geminiResponse.json()
    const verification = JSON.parse(aiResult.candidates[0].content.parts[0].text.replace(/```json|```/g, ''))

    if (verification.verified) {
      // 5. Update Database to ACTIVE
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 30)

      await supabaseClient
        .from('members')
        .update({ status: 'active', expiry_date: expiry.toISOString() })
        .eq('id', member.id)

      await supabaseClient.from('payments').insert([{
        member_id: member.id,
        amount: verification.amount,
        transaction_id: verification.transaction_id,
        is_verified: true
      }])

      // 6. Send success notification back to user (Requires WhatsApp Message API)
      await fetch(`https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${waToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: senderNumber,
          text: { body: `✅ Payment Verified!\n\nWelcome back, ${member.full_name}. Your Benny Gym membership is now ACTIVE until ${expiry.toLocaleDateString()}. Feel like yourself again!` }
        })
      })
    }

    return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS })

  } catch (error) {
    console.error("Verification Error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS_HEADERS })
  }
})
