import { useState, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Package } from 'lucide-react';
import Header from '@/components/Header';
import CategoryDrawer from '@/components/CategoryDrawer';
import HeroCarousel from '@/components/HeroCarousel';
import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import OrderModal from '@/components/OrderModal';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSize, setOrderSize] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
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

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEO />

        {/* Header */}
        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => updateFilter('searchQuery', query)}
        />

        {/* Category Drawer */}
        <CategoryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={(category) => updateFilter('category', category)}
        />

        {/* Hero Carousel */}
        <HeroCarousel onShopClick={scrollToProducts} />

        {/* Filters */}
        <Filters
          categories={categories}
          filters={filters}
          onFilterChange={updateFilter}
          productCount={products.length}
        />

        {/* Products Section */}
        <main ref={productsRef} id="products" className="py-12">
          <div className="container">
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                {filters.category === 'All Jerseys' ? 'All Products' : filters.category}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse our collection of authentic football jerseys
              </p>
            </div>

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
                <h3 className="text-xl font-semibold text-foreground">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Buttons */}
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

export default Index;
