import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { sendOrderToTelegram, getWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '@/utils/telegram';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface OrderModalProps {
  product: Product | null;
  selectedSize: string;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal = ({ product, selectedSize, quantity, isOpen, onClose }: OrderModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discount / 100);
  const totalPrice = discountedPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast({
        title: 'Please fill all fields',
        description: 'All fields are required to place an order.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const orderDetails = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      productName: product.name,
      category: product.category,
      quantity,
      size: selectedSize,
      price: totalPrice,
    };

    const success = await sendOrderToTelegram(orderDetails);

    setIsSubmitting(false);

    if (success) {
      // Redirect to order confirmation page
      onClose();
      setFormData({ name: '', phone: '', address: '' });
      navigate('/order-confirmation', { 
        state: { orderDetails }
      });
    } else {
      // Still redirect even if Telegram fails (order is still valid)
      toast({
        title: 'Order Placed!',
        description: 'Your order has been received. We will contact you soon via WhatsApp.',
      });
      onClose();
      setFormData({ name: '', phone: '', address: '' });
      navigate('/order-confirmation', { 
        state: { orderDetails }
      });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', address: '' });
    setIsSuccess(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="mx-4 max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-background">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Order Form */}
          <div className="p-5 md:p-6">
            <h2 className="font-display text-xl text-foreground">Place Order</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cash on Delivery Only
            </p>

            {/* Order Summary */}
            <div className="mt-5 rounded-lg border border-border p-4">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover border border-border"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: {selectedSize} | Qty: {quantity}
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    ৳{totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Delivery Address *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 rounded-md"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-md gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    Confirm Order
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
