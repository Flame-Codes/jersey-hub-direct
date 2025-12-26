import { useState, useEffect, useMemo } from 'react';
import { Product, ProductsData, FilterState } from '@/types/product';
import { getJerseyImage } from '@/assets/jerseys';

export const useProducts = () => {
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Jerseys',
    priceRange: [0, 10000],
    searchQuery: '',
    sortBy: 'featured',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) throw new Error('Failed to fetch products');
        const jsonData = await response.json();
        
        // Apply local images to products
        const productsWithLocalImages = jsonData.products.map((product: Product) => ({
          ...product,
          image: getJerseyImage(product.id, product.image),
        }));
        
        setData({
          ...jsonData,
          products: productsWithLocalImages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    let result = [...data.products];

    // Filter by category
    if (filters.category !== 'All Jerseys') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by price range
    result = result.filter((p) => {
      const discountedPrice = p.price * (1 - p.discount / 100);
      return discountedPrice >= filters.priceRange[0] && discountedPrice <= filters.priceRange[1];
    });

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100);
          const priceB = b.price * (1 - b.discount / 100);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.price * (1 - a.discount / 100);
          const priceB = b.price * (1 - b.discount / 100);
          return priceB - priceA;
        });
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [data, filters]);

  const featuredProducts = useMemo(() => {
    return data?.products.filter((p) => p.featured) || [];
  }, [data]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    products: filteredProducts,
    featuredProducts,
    categories: data?.categories || [],
    loading,
    error,
    filters,
    updateFilter,
  };
};
