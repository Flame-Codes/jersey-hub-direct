const TELEGRAM_BOT_TOKEN = "7717939554:AAGTywwmtfeS2LY9h7x7A327TTuWsn4tv2A";
const TELEGRAM_CHAT_ID = "6078665585";
const WHATSAPP_NUMBER = "8801952081184";

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  productName: string;
  category: string;
  quantity: number;
  size: string;
  price: number;
}

export const sendOrderToTelegram = async (order: OrderData): Promise<boolean> => {
  const message = `
🛒 *New Order Received!*

👤 *Customer Details:*
━━━━━━━━━━━━━━━━━━
📛 Name: ${order.name}
📞 Phone: ${order.phone}
📍 Address: ${order.address}

🏷️ *Product Details:*
━━━━━━━━━━━━━━━━━━
👕 Product: ${order.productName}
📂 Category: ${order.category}
📏 Size: ${order.size}
🔢 Quantity: ${order.quantity}
💰 Price: ৳${order.price.toLocaleString()}

⏰ Time: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
━━━━━━━━━━━━━━━━━━
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to send order to Telegram:", error);
    return false;
  }
};

export const getWhatsAppLink = (message?: string): string => {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
};

export const getOrderWhatsAppLink = (orderDetails: {
  name: string;
  phone: string;
  address: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
}): string => {
  const message = `🛒 *New Order*

👤 *Customer:* ${orderDetails.name}
📞 *Phone:* ${orderDetails.phone}
📍 *Address:* ${orderDetails.address}

👕 *Product:* ${orderDetails.productName}
📏 *Size:* ${orderDetails.size}
🔢 *Quantity:* ${orderDetails.quantity}
💰 *Total:* ৳${orderDetails.price.toLocaleString()}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const WHATSAPP_DISPLAY_NUMBER = "01952081184";
