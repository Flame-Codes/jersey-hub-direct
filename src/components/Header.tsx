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

const Header = ({ onMenuClick, searchQuery, onSearchChange }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Banner */}
      <div className="gradient-gold py-2 px-4 text-center">
        <p className="text-sm font-medium text-primary-foreground">
          ⚽ Authentic Jerseys • Trusted Service • Fast Delivery 🚚
        </p>
      </div>

      {/* Main Header */}
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-foreground hover:bg-secondary"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl tracking-wide text-foreground">
                JERSEY<span className="text-primary">HUB</span>
              </h1>
            </div>
          </Link>
        </div>

        {/* Center - Desktop Search */}
        <div className="hidden flex-1 max-w-xl lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jerseys..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-secondary"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
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
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-secondary"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
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
