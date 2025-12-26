import { useState, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Package } from 'lucide-react';
import Header from '@/components/Header';
import CategoryDrawer from '@/components/CategoryDrawer';
import HeroCarousel from '@/components/HeroCarousel';
import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const productsRef = useRef<HTMLElement>(null);

  const {
    products,
    categories,
    loading,
    filters,
    updateFilter,
  } = useProducts();

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrderFromCard = (product: Product) => {
    navigate('/order', {
      state: {
        product,
        selectedSize: product.sizes[0] || '',
        quantity: 1,
      }
    });
  };

  const handleOrderFromModal = (product: Product, size: string, quantity: number) => {
    setIsProductModalOpen(false);
    navigate('/order', {
      state: {
        product,
        selectedSize: size,
        quantity,
      }
    });
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO />

        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter('searchQuery', query)}
        />

        <CategoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={(category) => updateFilter('category', category)}
        />

        <HeroCarousel onShopClick={scrollToProducts} />

        <Filters
          categories={categories}
          filters={filters}
          onFilterChange={updateFilter}
          productCount={products.length}
        />

        <main ref={productsRef} id="products" className="py-12">
          <div className="container">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-display text-foreground">
                {filters.category === 'All Jerseys' ? 'All Products' : filters.category}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse our collection of authentic football jerseys
              </p>
            </div>

            {loading && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl bg-muted"
                  />
                ))}
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard
                      product={product}
                      onQuickView={handleQuickView}
                      onOrder={handleOrderFromCard}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
        <WhatsAppButton />
        <BackToTop />

        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onOrder={handleOrderFromModal}
        />
      </div>
    </HelmetProvider>
  );
};

export default Index;