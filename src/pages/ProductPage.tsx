import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowLeft, Share2, Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import OrderModal from '@/components/OrderModal';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        const foundProduct = data.products.find((p: Product) => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes[0] || '');
          
          // Get related products from same category
          const related = data.products
            .filter((p: Product) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const discountedPrice = product
    ? product.price - (product.price * product.discount) / 100
    : 0;

  const images = product?.images || (product ? [product.image] : []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-display text-foreground">Product not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title={`${product.name} | JerseyHub`}
          description={product.description}
          image={product.image}
        />

        <Header onMenuClick={() => {}} searchQuery="" onSearchChange={() => {}} />

        {/* Breadcrumb */}
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link 
              to={`/category/${encodeURIComponent(product.category)}`} 
              className="hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <main className="container pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground">
                    -{product.discount}%
                  </Badge>
                )}

                {/* Stock Badge */}
                {!product.stock && (
                  <Badge variant="destructive" className="absolute right-4 top-4">
                    Out of Stock
                  </Badge>
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                        currentImageIndex === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-primary">{product.category}</p>
                <h1 className="mt-2 font-display text-3xl md:text-4xl text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-primary">
                  ৳{discountedPrice.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    product.stock ? "bg-green-500" : "bg-red-500"
                  )}
                />
                <span className={product.stock ? "text-green-500" : "text-red-500"}>
                  {product.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[48px] rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-lg border border-border p-2 transition-colors hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[40px] text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-lg border border-border p-2 transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="gold"
                  size="lg"
                  className="flex-1"
                  onClick={() => setIsOrderModalOpen(true)}
                  disabled={!product.stock}
                >
                  Order Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="px-4"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* COD Notice */}
              <div className="rounded-xl bg-secondary/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  💵 Cash on Delivery Only • 🚚 Fast Delivery • 📞 WhatsApp Support
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 font-display text-2xl text-foreground">
                Related Products
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/product/${rp.id}`}
                    className="group overflow-hidden rounded-xl bg-card transition-transform hover:scale-[1.02]"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{rp.category}</p>
                      <h3 className="mt-1 font-medium text-foreground line-clamp-1">
                        {rp.name}
                      </h3>
                      <p className="mt-1 text-primary font-semibold">
                        ৳{(rp.price - (rp.price * rp.discount) / 100).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
        <WhatsAppButton />
        <BackToTop />

        <OrderModal
          product={product}
          selectedSize={selectedSize}
          quantity={quantity}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      </div>
    </HelmetProvider>
  );
};

export default ProductPage;
