import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowLeft, Minus, Plus, Package, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { sendOrderToTelegram, getOrderWhatsAppLink } from '@/utils/telegram';
import { useToast } from '@/hooks/use-toast';
import { getJerseyImage } from '@/assets/jerseys';

interface OrderState {
  product: Product;
  selectedSize: string;
  quantity: number;
}

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderState, setOrderState] = useState<OrderState | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const state = location.state as OrderState;
    if (state?.product) {
      const productWithImage = {
        ...state.product,
        image: getJerseyImage(state.product.id, state.product.image),
      };
      setOrderState({ ...state, product: productWithImage });
      setQuantity(state.quantity || 1);
      setSelectedSize(state.selectedSize || state.product.sizes[0] || '');
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!orderState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const { product } = orderState;
  const discountedPrice = product.price * (1 - product.discount / 100);
  const totalPrice = discountedPrice * quantity;

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

    const orderDetails = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      productName: product.name,
      category: product.category,
      quantity,
      size: selectedSize,
      price: totalPrice,
    };

    // Send to Telegram
    await sendOrderToTelegram(orderDetails);

    // Generate WhatsApp link and redirect
    const whatsappLink = getOrderWhatsAppLink(orderDetails);
    
    setIsSubmitting(false);
    
    // Open WhatsApp with order details
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');

    // Navigate to confirmation
    navigate('/order-confirmation', { 
      state: { orderDetails }
    });
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title="Place Order | JerseyHub"
          description="Complete your order for authentic football jerseys"
        />

        <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />

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
            <h1 className="text-2xl md:text-3xl font-display text-foreground mb-6">
              Complete Your Order
            </h1>

            {/* Product Summary */}
            <div className="card-elevated p-4 md:p-6 mb-6 animate-slide-up">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-medium">{product.category}</p>
                  <h2 className="font-semibold text-foreground mt-1 truncate">{product.name}</h2>
                  
                  {/* Size Selector */}
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[40px] px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Qty:</span>
                  <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">৳{totalPrice.toLocaleString()}</p>
                  {product.discount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">
                      ৳{(product.price * quantity).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-semibold text-foreground mb-4">Delivery Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-modern"
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
                    className="input-modern"
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
                    className="input-modern"
                    required
                  />
                </div>
              </div>

              {/* COD Notice */}
              <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-sm text-success font-medium flex items-center gap-2">
                  <span>💵</span>
                  Cash on Delivery - Pay when you receive
                </p>
              </div>

              {/* Desktop Submit Button */}
              <Button
                type="submit"
                className="hidden md:flex w-full mt-6 btn-primary gap-2"
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
                    <MessageCircle className="h-5 w-5" />
                    Confirm & Order via WhatsApp
                  </>
                )}
              </Button>
            </form>
          </div>
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="md:hidden sticky-bottom-bar p-4">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full btn-primary gap-2"
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
                <MessageCircle className="h-5 w-5" />
                Confirm Order • ৳{totalPrice.toLocaleString()}
              </>
            )}
          </Button>
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default OrderPage;