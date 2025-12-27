import { supabase } from "@/integrations/supabase/client";

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
  try {
    const { data, error } = await supabase.functions.invoke('send-order', {
      body: order
    });

    if (error) {
      console.error("Failed to send order:", error);
      return false;
    }

    return data?.success === true;
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
