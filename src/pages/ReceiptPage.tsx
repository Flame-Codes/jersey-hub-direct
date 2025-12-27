import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { 
  Package, Calendar, CreditCard, User, Phone, MapPin, 
  Home, Download, CheckCircle, ArrowLeft, Loader2 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  productImage?: string;
}

const ReceiptPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Get order details from navigation state or simulate loading
  useEffect(() => {
    const stateOrder = location.state?.orderDetails;
    
    // Simulate loading for smooth UX
    const timer = setTimeout(() => {
      if (stateOrder) {
        setOrderDetails(stateOrder);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.state]);

  const orderDate = new Date().toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !orderDetails) return;
    
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`JerseyHub-Receipt-${id}.pdf`);
      
      toast({
        title: 'Receipt Downloaded',
        description: 'Your receipt has been saved as a PDF.',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading Skeleton UI
  if (isLoading) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-background">
          <SEO
            title="Order Receipt | JerseyHub"
            description="View your order receipt and details."
          />
          <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />
          
          <main className="container py-8 md:py-12">
            <div className="mx-auto max-w-2xl">
              {/* Loading Header */}
              <div className="text-center mb-8">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>

              {/* Loading Order Details Card */}
              <div className="mb-6 rounded-lg border border-border bg-background p-5">
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Product Summary */}
              <div className="mb-6 rounded-lg border border-border bg-background p-5">
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>

              {/* Loading Customer Info */}
              <div className="mb-6 rounded-lg border border-border bg-background p-5">
                <Skeleton className="h-4 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-12 flex-1 rounded-md" />
                <Skeleton className="h-12 flex-1 rounded-md" />
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  // No order details found
  if (!orderDetails) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-background">
          <SEO
            title="Order Receipt | JerseyHub"
            description="View your order receipt and details."
          />
          <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />
          
          <main className="container py-8 md:py-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-muted-foreground mx-auto">
                <Package className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't find the order details. This may happen if you accessed this page directly.
              </p>
              <Link to="/">
                <Button className="h-11 gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium rounded-md">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </main>
          
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background print:bg-white">
        <SEO
          title={`Order Receipt ${id} | JerseyHub`}
          description="View your order receipt and details."
        />
        
        <div className="print:hidden">
          <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />
        </div>

        <main className="container py-8 md:py-12">
          <div ref={receiptRef} className="mx-auto max-w-2xl animate-fade-in bg-white p-6 rounded-lg">
            
            {/* Back Button - Hidden on Print */}
            <div className="mb-6 print:hidden">
              <Link 
                to="/order-confirmation" 
                state={{ orderDetails }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to confirmation
              </Link>
            </div>

            {/* Receipt Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-foreground bg-background print:border-black">
                <CheckCircle className="h-8 w-8 text-foreground print:text-black" strokeWidth={1.5} />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-1">
                Order Receipt
              </h1>
              <p className="text-muted-foreground text-sm">
                Order ID: <span className="font-medium text-foreground">{id}</span>
              </p>
            </div>

            {/* Order Status Card */}
            <div className="mb-6 rounded-lg border border-border bg-background p-5 print:border-gray-300">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Order Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="text-sm font-medium text-foreground">{id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Order Date</p>
                    <p className="text-sm font-medium text-foreground">{orderDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium text-green-600">Confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Summary with Image */}
            <div className="mb-6 rounded-lg border border-border bg-background p-5 print:border-gray-300">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Items Ordered
              </h2>
              <div className="flex gap-4">
                {orderDetails.productImage && (
                  <div className="flex-shrink-0">
                    <img 
                      src={orderDetails.productImage} 
                      alt={orderDetails.productName}
                      className="h-20 w-20 object-cover rounded-md border border-border"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground mb-1 truncate">
                    {orderDetails.productName}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    Size: {orderDetails.size} · Qty: {orderDetails.quantity}
                  </p>
                  <p className="text-base font-bold text-foreground">
                    ৳{orderDetails.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">৳{orderDetails.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">Free</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">৳{orderDetails.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6 rounded-lg border border-border bg-background p-5 print:border-gray-300">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer Name</p>
                    <p className="text-sm font-medium text-foreground">{orderDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-sm font-medium text-foreground">{orderDetails.phone}</p>
                  </div>
                </div>
                {orderDetails.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 print:text-gray-500" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery Address</p>
                      <p className="text-sm font-medium text-foreground">{orderDetails.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Hidden on Print */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <Link to="/" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full h-12 gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-medium rounded-md"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex-1 h-12 gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
              <p>Thank you for shopping with JerseyHub!</p>
              <p className="mt-1">For any queries, contact us on WhatsApp: 01952081184</p>
            </div>

          </div>
        </main>
        
        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ReceiptPage;
