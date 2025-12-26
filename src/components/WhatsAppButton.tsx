import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/telegram';

const WhatsAppButton = () => {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse-gold"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
