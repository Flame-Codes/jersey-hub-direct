import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { 
  CheckCircle, MessageCircle, Home, ShoppingBag, Package, 
  Calendar, CreditCard, User, Phone, MapPin 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '@/utils/telegram';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Generate order ID and date
  const orderId = `JH${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Simple confirmation message for WhatsApp (no order details)
  const whatsAppConfirmMessage = "✅ My order has been confirmed. Looking forward to receiving it soon!";

  // Loading Skeleton Component with Tailwind animate-pulse and bg-gray-200
  const LoadingSkeleton = () => (
    <>
      {/* Loading Success Indicator */}
      <div className="text-center mb-8">
        <div className="h-20 w-20 rounded-full mx-auto mb-6 bg-gray-200 animate-pulse" />
        <div className="h-8 w-56 mx-auto mb-2 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-4 w-72 mx-auto bg-gray-200 animate-pulse rounded-lg" />
      </div>

      {/* Loading Order Details Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-4 w-24 mb-4 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 w-16 mb-1 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Product Summary */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-4 w-32 mb-4 bg-gray-200 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Customer Info */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-4 w-40 mb-4 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 w-16 mb-1 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading WhatsApp Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div>
            <div className="h-4 w-24 mb-1 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-11 w-full rounded-md bg-gray-200" />
      </div>

      {/* Loading Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-12 flex-1 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-12 flex-1 rounded-md bg-gray-200 animate-pulse" />
      </div>
    </>
  );

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title="Order Confirmed | JerseyHub"
          description="Your order has been placed successfully. Our team will contact you shortly."
        />

        <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />

        <main className="container py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="animate-fade-in">
                {/* Success Indicator Section */}
                <div className="text-center mb-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500 bg-green-50">
                    <CheckCircle className="h-10 w-10 text-green-500" strokeWidth={1.5} />
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Order Confirmed
                  </h1>
                  <p className="text-muted-foreground mb-3">
                    Thank you for your purchase. Your order has been received.
                  </p>
                  {/* Track Order Button - Green Theme */}
                  <Link 
                    to={`/receipt/${orderId}`}
                    state={{ orderDetails }}
                  >
                    <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-6 py-2 h-auto gap-2 transition-all active:scale-[0.98]">
                      Track your order here &gt;&gt;
                    </Button>
                  </Link>
                </div>

                {/* Order Status Card */}
                <div className="mb-6 rounded-lg border border-border bg-background p-5 shadow-sm">
                  <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                    Order Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="text-sm font-medium text-foreground">{orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-muted-foreground">Order Date</p>
                        <p className="text-sm font-medium text-foreground">{orderDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-muted-foreground">Payment Method</p>
                        <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-medium text-green-600">Confirmed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product & Customer Information */}
                {orderDetails && (
                  <>
                    {/* Product Summary */}
                    <div className="mb-6 rounded-lg border border-border bg-background p-5 shadow-sm">
                      <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                        Product Summary
                      </h2>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product</span>
                          <span className="text-foreground font-medium text-right max-w-[60%]">{orderDetails.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size</span>
                          <span className="text-foreground">{orderDetails.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="text-foreground">{orderDetails.quantity}</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3 flex justify-between">
                          <span className="text-foreground font-semibold">Total</span>
                          <span className="text-foreground font-bold text-lg">
                            ৳{orderDetails.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="mb-6 rounded-lg border border-border bg-background p-5 shadow-sm">
                      <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                        Customer Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                          <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="text-sm font-medium text-foreground">{orderDetails.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium text-foreground">{orderDetails.phone}</p>
                          </div>
                        </div>
                        {orderDetails.address && (
                          <div className="flex items-start gap-3 md:col-span-2">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                            <div>
                              <p className="text-xs text-muted-foreground">Delivery Address</p>
                              <p className="text-sm font-medium text-foreground">{orderDetails.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* WhatsApp Contact Card - Green Theme */}
                <div className="mb-6 rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                      <MessageCircle className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Need Help?</p>
                      <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
                    </div>
                  </div>
                  <a
                    href={getWhatsAppLink(whatsAppConfirmMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      className="w-full h-11 bg-[#25D366] hover:bg-[#1DA851] text-white font-medium rounded-md gap-2 shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp: {WHATSAPP_DISPLAY_NUMBER}
                    </Button>
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-medium rounded-md transition-all active:scale-[0.98]"
                    >
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/#products" className="flex-1">
                    <Button 
                      className="w-full h-12 gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-md transition-all active:scale-[0.98]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* COD Notice */}
                <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Cash on Delivery</span> — Pay when you receive your order
                  </p>
                </div>

                {/* What Happens Next */}
                <div className="mt-6 rounded-lg border border-border bg-background p-5 shadow-sm">
                  <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                    What Happens Next?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">1</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Order Processing</p>
                        <p className="text-xs text-muted-foreground">We're preparing your order for shipment</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">2</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Confirmation Call</p>
                        <p className="text-xs text-muted-foreground">Our team will contact you to confirm your order</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">3</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Fast Delivery</p>
                        <p className="text-xs text-muted-foreground">Receive your jersey within 2-5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default OrderConfirmation;
