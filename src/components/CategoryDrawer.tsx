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
          'fixed left-0 top-0 z-50 h-full w-[280px] border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Shirt className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg tracking-wide">Categories</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Categories List */}
        <nav className="p-4">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    onCategorySelect(category);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <span>{category}</span>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      selectedCategory === category && 'rotate-90'
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2025 JerseyStore</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CategoryDrawer;
