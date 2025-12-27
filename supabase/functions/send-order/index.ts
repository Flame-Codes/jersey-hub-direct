import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side validation schema
const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long").trim(),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone too long").trim(),
  address: z.string().min(10, "Address must be at least 10 characters").max(300, "Address too long").trim(),
  productName: z.string().min(1, "Product name required").max(200, "Product name too long"),
  category: z.string().max(100).optional(),
  quantity: z.number().int().positive().max(100, "Max quantity is 100"),
  size: z.string().min(1, "Size required").max(20),
  price: z.number().positive("Price must be positive"),
});

// Escape markdown special characters for Telegram
function escapeMarkdown(text: string): string {
  return text.replace(/[*_`\[\]()~>#+=|{}.!-]/g, '\\$&');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    console.log('Received order request:', JSON.stringify(body, null, 2));

    // Validate input using Zod schema
    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid order data', 
          details: validationResult.error.errors.map(e => e.message) 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = validationResult.data;

    // Escape all user inputs to prevent markdown injection
    const safeName = escapeMarkdown(order.name);
    const safePhone = escapeMarkdown(order.phone);
    const safeAddress = escapeMarkdown(order.address);
    const safeProductName = escapeMarkdown(order.productName);
    const safeCategory = order.category ? escapeMarkdown(order.category) : 'N/A';
    const safeSize = escapeMarkdown(order.size);

    const message = `
🛒 *New Order Received\\!*

👤 *Customer Details:*
━━━━━━━━━━━━━━━━━━
📛 Name: ${safeName}
📞 Phone: ${safePhone}
📍 Address: ${safeAddress}

🏷️ *Product Details:*
━━━━━━━━━━━━━━━━━━
👕 Product: ${safeProductName}
📂 Category: ${safeCategory}
📏 Size: ${safeSize}
🔢 Quantity: ${order.quantity}
💰 Price: ৳${order.price.toLocaleString()}

⏰ Time: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
━━━━━━━━━━━━━━━━━━
`;

    console.log('Sending message to Telegram...');
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2',
        }),
      }
    );

    const telegramResult = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', telegramResult);
      return new Response(
        JSON.stringify({ error: 'Failed to send notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order notification sent successfully');
    
    return new Response(
      JSON.stringify({ success: true, message: 'Order submitted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-order function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
