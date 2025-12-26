import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterState, SortOption } from '@/types/product';

interface FiltersProps {
  categories: string[];
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  productCount: number;
}

const Filters = ({ categories, filters, onFilterChange, productCount }: FiltersProps) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <div className="border-b border-border bg-card/50 py-4">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left - Category & Count */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Select
                value={filters.category}
                onValueChange={(value) => onFilterChange('category', value)}
              >
                <SelectTrigger className="w-[200px] bg-secondary border-border">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{productCount}</span> products
            </span>
          </div>

          {/* Right - Sort */}
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">Sort by:</span>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange('sortBy', value as SortOption)}
            >
              <SelectTrigger className="w-[180px] bg-secondary border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Category Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('category', category)}
              className="shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
