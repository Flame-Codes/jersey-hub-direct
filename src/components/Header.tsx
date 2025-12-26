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

// Custom Football Jersey SVG Logo
const JerseyLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Jersey Body */}
    <path
      d="M12 16V40C12 41.1 12.9 42 14 42H34C35.1 42 36 41.1 36 40V16"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left Sleeve */}
    <path
      d="M12 16L4 20V28L12 26"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Sleeve */}
    <path
      d="M36 16L44 20V28L36 26"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Collar */}
    <path
      d="M18 6C18 6 20 10 24 10C28 10 30 6 30 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Shoulder Lines */}
    <path
      d="M12 16C12 16 16 12 18 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 16C36 16 32 12 30 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Number/Star decoration */}
    <circle
      cx="24"
      cy="28"
      r="6"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fontSize="8"
      fontWeight="bold"
      fill="currentColor"
    >
      ★
    </text>
  </svg>
);

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
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMenuClick();
            }}
            className="lg:hidden text-foreground hover:bg-secondary active:scale-95 transition-transform touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </Button>

          {/* Logo with Custom SVG */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-gold shadow-lg">
              <JerseyLogo className="h-7 w-7 text-white" />
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
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-secondary active:scale-95 transition-transform touch-manipulation"
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
              className="text-foreground hover:bg-secondary active:scale-95 transition-transform touch-manipulation"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold animate-scale-in">
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
