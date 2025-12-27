import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryDrawer = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryDrawerProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
    if (category === 'All Jerseys') {
      navigate('/');
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] border-r border-border bg-background transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <Shirt className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-base font-medium tracking-wide text-foreground">Categories</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu" className="h-9 w-9 rounded-full hover:bg-secondary">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Categories List */}
        <nav className="p-3">
          <ul className="space-y-0.5">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150',
                    selectedCategory === category
                      ? 'bg-foreground text-background font-medium'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <span>{category}</span>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 opacity-50',
                      selectedCategory === category && 'opacity-100'
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border px-4 py-3">
          <div className="text-center text-[11px] text-muted-foreground">
            <p>© 2025 JerseyHub</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CategoryDrawer;
