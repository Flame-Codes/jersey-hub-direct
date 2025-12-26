import { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onOrder: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView, onOrder }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <article className="group relative overflow-hidden rounded-xl bg-card border border-border hover-lift">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="badge-discount">-{product.discount}%</span>
        )}

        {/* Stock Badge */}
        {!product.stock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <span className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500 group-hover:scale-110',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="gold"
            size="icon"
            onClick={() => onOrder(product)}
            disabled={!product.stock}
            aria-label="Order now"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ৳{discountedPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              +{product.sizes.length - 4}
            </span>
          )}
        </div>

        {/* Order Button */}
        <Button
          variant="gold"
          className="mt-4 w-full"
          onClick={() => onOrder(product)}
          disabled={!product.stock}
        >
          <ShoppingCart className="h-4 w-4" />
          Order Now
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
