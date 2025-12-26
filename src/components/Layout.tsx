import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CategoryDrawer from '@/components/CategoryDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';

interface LayoutProps {
  showFooter?: boolean;
}

const Layout = ({ showFooter = true }: LayoutProps) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, updateFilter, filters } = useProducts();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateFilter('searchQuery', query);
    // Navigate to home if searching from another page
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleCategorySelect = (category: string) => {
    updateFilter('category', category);
  };

  return (
    <div className="min-h-screen bg-background">
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
        onCategorySelect={handleCategorySelect}
      />

      <Outlet />

      {showFooter && <Footer />}
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Layout;
