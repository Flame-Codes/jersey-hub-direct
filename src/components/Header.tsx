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

// Premium Store Logo
const StoreLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-1", className)}>
    <span className="font-display text-xl font-semibold tracking-tight text-foreground">
      JERSEY
    </span>
    <span className="font-display text-xl font-light tracking-tight text-muted-foreground">
      HUB
    </span>
  </div>
);

const Header = ({ onMenuClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Main Header - Premium Clean */}
      <div className="container flex h-14 items-center justify-between">
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
            className="h-10 w-10 rounded-full text-foreground hover:bg-secondary active:scale-95 transition-all touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <StoreLogo />
        </Link>

        {/* Right Section - Search & Cart */}
        <div className="flex items-center gap-1">
          {/* Search Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-foreground hover:bg-secondary active:scale-95 transition-all touch-manipulation"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSearchOpen(!isSearchOpen);
            }}
            aria-label="Toggle search"
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Search className="h-5 w-5" strokeWidth={1.5} />
            )}
          </Button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-foreground hover:bg-secondary active:scale-95 transition-all touch-manipulation"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold">
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
          'overflow-hidden transition-all duration-200',
          isSearchOpen ? 'max-h-14 py-2 border-t border-border' : 'max-h-0'
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
              className="pl-10 h-10 bg-secondary border-0 text-foreground placeholder:text-muted-foreground rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
