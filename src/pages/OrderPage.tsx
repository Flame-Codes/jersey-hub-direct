import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowLeft, Minus, Plus, MessageCircle, Send } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { sendOrderToTelegram, getWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '@/utils/telegram';
import { useToast } from '@/hooks/use-toast';
import { getJerseyImage } from '@/assets/jerseys';
import { useCart, CartItem } from '@/contexts/CartContext';

interface OrderState {
  product?: Product;
  selectedSize?: string;
  quantity?: number;
  cartItems?: CartItem[];
  fromCart?: boolean;
}

interface OrderItem {
  product: Product;
  size: string;
  quantity: number;
}

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const state = location.state as OrderState;
    
    if (state?.fromCart && state?.cartItems) {
      // From cart page
      const items = state.cartItems.map((item) => ({
        product: {
          ...item.product,
          image: getJerseyImage(item.product.id, item.product.image),
        },
        size: item.size,
        quantity: item.quantity,
      }));
      setOrderItems(items);
    } else if (state?.product) {
      // Single product order
      const productWithImage = {
        ...state.product,
        image: getJerseyImage(state.product.id, state.product.image),
      };
      setOrderItems([{
        product: productWithImage,
        size: state.selectedSize || state.product.sizes[0] || '',
        quantity: state.quantity || 1,
      }]);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalPrice = orderItems.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
    );
  };

  const updateItemSize = (index: number, newSize: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, size: newSize } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast({
        title: 'Please fill all fields',
        description: 'All fields are required to place an order.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Send FULL order details to Telegram ONLY
    for (const item of orderItems) {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      await sendOrderToTelegram({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        productName: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        size: item.size,
        price: discountedPrice * item.quantity,
      });
    }

    // Clear cart if order was from cart
    const state = location.state as OrderState;
    if (state?.fromCart) {
      clearCart();
    }

    setIsSubmitting(false);
    setOrderPlaced(true);
    
    toast({
      title: 'Order Placed Successfully!',
      description: 'We will contact you shortly via WhatsApp.',
    });
  };

  const handleWhatsAppConfirmation = () => {
    // Simple confirmation message only - NO full order details
    const confirmationMessage = `✅ Hi! I just placed an order on JerseyHub. Order Total: ৳${totalPrice.toLocaleString()}. Please confirm my order.`;
    const whatsappLink = getWhatsAppLink(confirmationMessage);
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  if (orderPlaced) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-background">
          <SEO title="Order Placed | JerseyHub" description="Your order has been placed successfully" />
          
          <main className="container py-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-foreground flex items-center justify-center">
                <Send className="w-7 h-7 text-foreground" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display text-foreground mb-3">
                Order Placed Successfully!
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Your order has been sent to our team. We will contact you shortly via WhatsApp to confirm your order.
              </p>

              <div className="border border-border rounded-lg p-5 mb-6 text-left">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Order Summary</h3>
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-3 border-b border-border last:border-0">
                    <span className="text-muted-foreground">
                      {item.product.name} ({item.size}) x{item.quantity}
                    </span>
                    <span className="text-foreground font-medium">
                      ৳{((item.product.price * (1 - item.product.discount / 100)) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleWhatsAppConfirmation}
                  className="w-full h-12 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(142,70%,40%)] text-white font-medium rounded-md gap-2"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Confirm on WhatsApp
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full h-12 bg-background border-foreground text-foreground hover:bg-secondary font-medium rounded-md"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </div>

              <p className="mt-8 text-xs text-muted-foreground">
                Need help? Call us at {WHATSAPP_DISPLAY_NUMBER}
              </p>
            </div>
          </main>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title="Place Order | JerseyHub"
          description="Complete your order for authentic football jerseys"
        />

        <main className="container py-6 pb-32 md:pb-12">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display text-foreground mb-8">
              Complete Your Order
            </h1>

            {/* Product Summary */}
            <div className="bg-background border border-border rounded-lg p-5 md:p-6 mb-8 space-y-5">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Order Items</h3>
              {orderItems.map((item, index) => {
                const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div key={`${item.product.id}-${item.size}-${index}`} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.product.category}</p>
                        <h2 className="font-medium text-foreground mt-1 truncate">{item.product.name}</h2>
                        
                        {/* Size Selector */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {item.product.sizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => updateItemSize(index, size)}
                                className={`min-w-[36px] px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                                  item.size === size
                                    ? 'border-foreground bg-foreground text-background'
                                    : 'border-border text-foreground hover:border-foreground'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm text-foreground">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-lg font-semibold text-foreground">৳{itemTotal.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="pt-5 border-t border-border flex justify-between items-center">
                <span className="text-muted-foreground">Total ({orderItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-2xl font-bold text-foreground">৳{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-5 md:p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-5">Delivery Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:ring-offset-0 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:ring-offset-0 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delivery Address *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-0 focus:ring-offset-0 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* COD Notice */}
              <div className="mt-6 p-4 rounded-lg bg-secondary border border-border">
                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                  <span>💵</span>
                  Cash on Delivery — Pay when you receive
                </p>
              </div>

              {/* Info about order flow */}
              <div className="mt-4 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">How it works:</strong> Your order will be sent to our team. We'll contact you via WhatsApp to confirm delivery details.
                </p>
              </div>

              {/* Desktop Submit Button */}
              <Button
                type="submit"
                className="hidden md:flex w-full mt-6 h-12 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-md gap-2 active:scale-[0.98] transition-all"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 shrink-0" />
                    Place Order • ৳{totalPrice.toLocaleString()}
                  </>
                )}
              </Button>
            </form>
          </div>
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e as any);
            }}
            className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-md gap-2 active:scale-[0.98] transition-all select-none"
            size="lg"
            disabled={isSubmitting}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 shrink-0" />
                Place Order • ৳{totalPrice.toLocaleString()}
              </>
            )}
          </Button>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default OrderPage;
