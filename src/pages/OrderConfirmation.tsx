import { Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CheckCircle, MessageCircle, Home, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink } from '@/utils/telegram';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title="Order Confirmed | JerseyHub"
          description="Your order has been placed successfully. Our team will contact you shortly."
        />

        <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />

        <main className="container py-16">
          <div className="mx-auto max-w-lg text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Order Placed Successfully!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order! Our team will contact you shortly via WhatsApp to confirm your order.
            </p>

            {/* Order Details Card */}
            {orderDetails && (
              <div className="mb-8 rounded-2xl bg-card border border-border p-6 text-left">
                <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="text-foreground font-medium">{orderDetails.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="text-foreground">{orderDetails.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="text-foreground">{orderDetails.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="text-foreground">{orderDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-foreground">{orderDetails.phone}</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="text-foreground font-semibold">Total:</span>
                    <span className="text-primary font-bold text-lg">
                      ৳{orderDetails.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Contact */}
            <div className="mb-8 rounded-xl bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Have questions about your order? Contact us on WhatsApp:
              </p>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp: 01952081184
                </Button>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/#products">
                <Button variant="gold" className="gap-2 w-full sm:w-auto">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* COD Notice */}
            <div className="mt-8 rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">
                💵 <strong>Cash on Delivery</strong> - Pay when you receive your order
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default OrderConfirmation;
