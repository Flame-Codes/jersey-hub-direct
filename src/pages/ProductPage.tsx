import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import CategoryDrawer from '@/components/CategoryDrawer';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { getJerseyImage } from '@/assets/jerseys';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { categories, filters, updateFilter } = useProducts();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        const foundProduct = data.products.find((p: Product) => p.id === id);
        
        if (foundProduct) {
          const productWithLocalImage = {
            ...foundProduct,
            image: getJerseyImage(foundProduct.id, foundProduct.image),
          };
          setProduct(productWithLocalImage);
          setSelectedSize(foundProduct.sizes[0] || '');
          
          // Get related products
          let related = data.products
            .filter((p: Product) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .map((p: Product) => ({
              ...p,
              image: getJerseyImage(p.id, p.image),
            }));
          
          if (related.length < 4) {
            const others = data.products
              .filter((p: Product) => p.id !== foundProduct.id && !related.find((r: Product) => r.id === p.id))
              .slice(0, 4 - related.length)
              .map((p: Product) => ({
                ...p,
                image: getJerseyImage(p.id, p.image),
              }));
            related = [...related, ...others];
          }
          
          setRelatedProducts(related.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const discountedPrice = product
    ? product.price - (product.price * product.discount) / 100
    : 0;

  const totalPrice = discountedPrice * quantity;
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
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?.stock) return;
    
    addToCart(product, selectedSize, quantity);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigate('/order', {
      state: {
        product,
        selectedSize,
        quantity,
      }
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateFilter('searchQuery', query);
    if (query) navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

        <Header 
          onMenuClick={() => setIsDrawerOpen(true)} 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
        />

        <CategoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={(cat) => {
            updateFilter('category', cat);
            setIsDrawerOpen(false);
            navigate(cat === 'All Jerseys' ? '/' : `/category/${encodeURIComponent(cat)}`);
          }}
        />

        {/* Breadcrumb */}
        <div className="container py-3 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link 
              to={`/category/${encodeURIComponent(product.category)}`} 
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <main className="container py-6 pb-32 md:pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                
                {product.discount > 0 && (
                  <div className="badge-discount">-{product.discount}%</div>
                )}

                {!product.stock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Out of Stock</span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 transition-colors hover:bg-background text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 transition-colors hover:bg-background text-foreground"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all",
                        currentImageIndex === index
                          ? "border-foreground"
                          : "border-border opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div>
                <p className="text-sm font-semibold text-primary">{product.category}</p>
                <h1 className="mt-2 text-2xl md:text-3xl font-display text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Price</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl font-bold text-foreground">
                    {discountedPrice.toLocaleString()} BDT
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {product.price.toLocaleString()} BDT
                      </span>
                      <span className="rounded-full bg-foreground text-background px-3 py-1 text-sm font-semibold">
                        Save {(product.price - discountedPrice).toLocaleString()} BDT
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[56px] rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all",
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground/50 bg-background"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center rounded-full border-2 border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors text-foreground rounded-l-full"
                  >
                    <Minus className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-foreground border-x-2 border-border">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors text-foreground rounded-r-full"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 rounded-full border-2 border-foreground bg-background py-3.5 text-sm font-bold uppercase tracking-wide text-foreground disabled:opacity-50 active:scale-[0.98] transition-all duration-200 touch-manipulation hover:bg-secondary"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleOrder}
                disabled={!product.stock}
                className="w-full rounded-full bg-foreground py-4 text-base font-bold uppercase tracking-wide text-background disabled:opacity-50 active:scale-[0.98] transition-all duration-200 touch-manipulation hover:bg-foreground/90"
              >
                BUY NOW
              </button>

              {/* Product Features */}
              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-foreground">. Player edition Logo</p>
                <p className="text-foreground">. Mash Fabric 170+ GSM</p>
                <p className="text-foreground">. 100% Premium</p>
                <p className="text-foreground">. High Quality Fabrics</p>
                <p className="text-foreground">. Cash On Delivery Available</p>
              </div>

              {/* Size Guide */}
              <div className="space-y-2 pt-4 border-t border-border">
                <p className="font-semibold text-foreground">Size :</p>
                <p className="text-muted-foreground">M = Height 26 inches, Chest 38</p>
                <p className="text-muted-foreground">L = Height 27 inches, Chest 40</p>
                <p className="text-muted-foreground">XL = Height 28 inches, Chest 42</p>
                <p className="text-muted-foreground">2xl = Height 30 inches, Chest 44</p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="mb-6 text-xl md:text-2xl font-display text-foreground">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/product/${rp.id}`}
                    className="group card-interactive overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{rp.category}</p>
                      <h3 className="mt-1 font-medium text-foreground line-clamp-1 text-sm">
                        {rp.name}
                      </h3>
                      <p className="mt-1 text-foreground font-bold">
                        BDT {(rp.price - (rp.price * rp.discount) / 100).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="md:hidden sticky-bottom-bar p-4 z-50">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border-2 border-border bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-foreground"
                >
                  <Minus className="h-4 w-4" strokeWidth={2} />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-foreground"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.stock}
                className="flex-1 rounded-full border-2 border-foreground bg-background py-3 text-sm font-bold uppercase tracking-wide text-foreground disabled:opacity-50 active:scale-[0.98] transition-all touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                ADD TO CART
              </button>
            </div>
            <button
              type="button"
              onClick={handleOrder}
              disabled={!product.stock}
              className="w-full rounded-full bg-foreground py-3.5 text-sm font-bold uppercase tracking-wide text-background disabled:opacity-50 active:scale-[0.98] transition-all touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              BUY NOW
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <Footer />
        </div>
        <WhatsAppButton />
        <BackToTop />
      </div>
    </HelmetProvider>
  );
};

export default ProductPage;
