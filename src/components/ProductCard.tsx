import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onOrder: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView, onOrder }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.stock) return;
    
    addToCart(product, product.sizes[0] || 'M', 1);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/order', {
      state: { product, selectedSize: product.sizes[0] || '', quantity: 1 }
    });
  };


  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product page
    navigate(`/product/${product.id}`);
  };

  return (
    <article className="group card-interactive overflow-hidden flex flex-col">
      {/* Image Section */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
      >
        {product.discount > 0 && (
          <div className="badge-discount z-20">
            -{product.discount}%
          </div>
        )}
        {!product.stock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 pointer-events-none">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Out of Stock</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted pointer-events-none" />}
      </div>
      
      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{product.category}</p>
        <h3 
          className="mt-1 font-medium text-foreground line-clamp-2 text-sm leading-snug cursor-pointer hover:underline"
          onClick={handleCardClick}
        >
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">৳{discountedPrice.toLocaleString()}</span>
          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>
          )}
        </div>
        
        {/* Action Buttons - Premium Style */}
        <div className="mt-3 flex flex-col gap-2 relative z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="w-full flex items-center justify-center rounded-full border border-foreground bg-background py-2.5 text-xs font-medium uppercase tracking-wide text-foreground disabled:opacity-40 active:scale-[0.98] transition-all duration-150 touch-manipulation select-none hover:bg-muted"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleOrder}
            disabled={!product.stock}
            className="w-full flex items-center justify-center rounded-full bg-foreground py-2.5 text-xs font-medium uppercase tracking-wide text-background disabled:opacity-40 active:scale-[0.98] transition-all duration-150 touch-manipulation select-none hover:opacity-80"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
