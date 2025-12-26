import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Store Logo Placeholder
const StoreLogo = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-display text-lg font-bold tracking-tight text-foreground">
      Additional<span className="text-primary">Store</span>
    </span>
  </div>
);

const Header = ({ onMenuClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Main Header - Clean Black/White */}
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left Section - Menu */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMenuClick();
            }}
            className="h-12 w-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 active:scale-95 transition-transform touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </Button>
        </div>

        {/* Center - Logo */}
        <Link to="/" className="flex items-center">
          <StoreLogo />
        </Link>

        {/* Right Section - Search & Cart */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 active:scale-95 transition-transform touch-manipulation"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSearchOpen(!isSearchOpen);
            }}
            aria-label="Toggle search"
          >
            {isSearchOpen ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Search className="h-6 w-6" strokeWidth={2} />
            )}
          </Button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 active:scale-95 transition-transform touch-manipulation"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-foreground text-background text-xs font-bold animate-scale-in">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 lg:hidden',
          isSearchOpen ? 'max-h-16 py-3' : 'max-h-0'
        )}
      >
        <div className="container">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jerseys..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
