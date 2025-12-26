import { useState } from 'react';
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

    const success = await sendOrderToTelegram({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      productName: product.name,
      category: product.category,
      quantity,
      size: selectedSize,
      price: totalPrice,
    });

    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
    } else {
      toast({
        title: 'Order sent!',
        description: 'Your order has been received. We will contact you soon.',
      });
      setIsSuccess(true);
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
        <div className="mx-4 max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>

          {isSuccess ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="font-display text-2xl text-foreground">Order Placed!</h2>
              <p className="mt-3 text-muted-foreground">
                Your order has been sent successfully. Our team will contact you via WhatsApp.
              </p>
              <p className="mt-2 text-sm text-primary font-medium">
                Contact: {WHATSAPP_DISPLAY_NUMBER}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={getWhatsAppLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" className="w-full">
                    Chat on WhatsApp
                  </Button>
                </a>
                <Button variant="outline" onClick={handleClose}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <div className="p-6">
              <h2 className="font-display text-2xl text-foreground">Place Order</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cash on Delivery Only
              </p>

              {/* Order Summary */}
              <div className="mt-6 rounded-lg bg-secondary p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {selectedSize} | Qty: {quantity}
                    </p>
                    <p className="mt-1 font-bold text-primary">
                      ৳{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
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
          )}
        </div>
      </div>
    </>
  );
};

export default OrderModal;
