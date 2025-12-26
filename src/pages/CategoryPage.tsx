import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Package, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import CategoryDrawer from '@/components/CategoryDrawer';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { getJerseyImage } from '@/assets/jerseys';

const CategoryPage = () => {
  const { name } = useParams();
  const categoryName = decodeURIComponent(name || '');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSize, setOrderSize] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        setAllCategories(data.categories);
        
        const filtered = data.products
          .filter((p: Product) => {
            const matchesCategory = p.category.toLowerCase() === categoryName.toLowerCase();
            const matchesSearch = searchQuery
              ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
              : true;
            return matchesCategory && matchesSearch;
          })
          .map((p: Product) => ({
            ...p,
            image: getJerseyImage(p.id, p.image),
          }));
        
        setProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, searchQuery]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrderFromCard = (product: Product) => {
    setSelectedProduct(product);
    setOrderSize(product.sizes[0] || '');
    setOrderQuantity(1);
    setIsOrderModalOpen(true);
  };

  const handleOrderFromModal = (product: Product, size: string, quantity: number) => {
    setSelectedProduct(product);
    setOrderSize(size);
    setOrderQuantity(quantity);
    setIsProductModalOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO
          title={`${categoryName} | JerseyHub`}
          description={`Browse our collection of ${categoryName} jerseys. Authentic quality, fast delivery, cash on delivery.`}
        />

        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CategoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categories={allCategories}
          selectedCategory={categoryName}
          onCategorySelect={() => {}}
        />

        {/* Breadcrumb & Header */}
        <div className="container py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">{categoryName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-foreground">
                {categoryName}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <main className="container pb-16">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                  onOrder={handleOrderFromCard}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No products in this category
              </h3>
              <p className="mt-2 text-muted-foreground">
                Check back soon for new arrivals!
              </p>
              <Link to="/" className="mt-4 inline-block">
                <Button variant="gold">Browse All Products</Button>
              </Link>
            </div>
          )}
        </main>

        <Footer />
        <WhatsAppButton />
        <BackToTop />

        {/* Modals */}
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onOrder={handleOrderFromModal}
        />

        <OrderModal
          product={selectedProduct}
          selectedSize={orderSize}
          quantity={orderQuantity}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      </div>
    </HelmetProvider>
  );
};

export default CategoryPage;
