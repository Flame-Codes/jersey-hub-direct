export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  image: string;
  images?: string[];
  sizes: string[];
  stock: boolean;
  featured?: boolean;
  description?: string;
}

export interface ProductsData {
  categories: string[];
  products: Product[];
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: SortOption;
}
