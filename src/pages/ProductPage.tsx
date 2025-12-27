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
            <div className="space-y-5">
              {/* Category & Title */}
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{product.category}</p>
                <h1 className="mt-1.5 text-xl md:text-2xl font-semibold text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-foreground">
                  ৳{discountedPrice.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base text-muted-foreground line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      Save ৳{(product.price - discountedPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-medium text-foreground uppercase tracking-wide">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[48px] h-10 px-4 text-sm font-medium transition-all border",
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground bg-background"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-foreground border-x border-border">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 h-10 border border-foreground bg-background text-sm font-medium uppercase tracking-wide text-foreground disabled:opacity-40 active:scale-[0.98] transition-all duration-150 touch-manipulation hover:bg-muted"
                >
                  Add to Cart
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleOrder}
                disabled={!product.stock}
                className="w-full h-12 bg-foreground text-sm font-medium uppercase tracking-wide text-background disabled:opacity-40 active:scale-[0.98] transition-all duration-150 touch-manipulation hover:opacity-90"
              >
                Buy Now
              </button>

              {/* Product Features */}
              <div className="pt-5 border-t border-border space-y-3">
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">Product Details</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-foreground"></span>
                    Player edition Logo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-foreground"></span>
                    Mash Fabric 170+ GSM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-foreground"></span>
                    100% Premium Quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-foreground"></span>
                    High Quality Fabrics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-foreground"></span>
                    Cash On Delivery Available
                  </li>
                </ul>
              </div>

              {/* Size Guide */}
              <div className="pt-5 border-t border-border space-y-3">
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">Size Guide</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>M</span><span>26" × 38"</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>L</span><span>27" × 40"</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>XL</span><span>28" × 42"</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>2XL</span><span>30" × 44"</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="mb-5 text-base font-medium text-foreground uppercase tracking-wide">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/product/${rp.id}`}
                    className="group block border border-border hover:border-foreground/20 transition-colors"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{rp.category}</p>
                      <h3 className="mt-0.5 font-medium text-foreground line-clamp-1 text-xs">
                        {rp.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        ৳{(rp.price - (rp.price * rp.discount) / 100).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-3 safe-bottom">
          <div className="flex items-center gap-2">
            {/* Quantity */}
            <div className="flex items-center border border-border">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-foreground"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-foreground border-x border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-foreground"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.stock}
              className="flex-1 h-10 border border-foreground bg-background text-xs font-medium uppercase tracking-wide text-foreground disabled:opacity-40 active:scale-[0.98] transition-all touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Add to Cart
            </button>
            {/* Buy Now */}
            <button
              type="button"
              onClick={handleOrder}
              disabled={!product.stock}
              className="flex-1 h-10 bg-foreground text-xs font-medium uppercase tracking-wide text-background disabled:opacity-40 active:scale-[0.98] transition-all touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Buy Now
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
