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
      {/* Image Section - Clickable to product page */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-secondary cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e as any)}
      >
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-[hsl(var(--discount))] px-3 py-1 text-xs font-semibold text-white">
            Save {product.discount}%
          </div>
        )}
        {!product.stock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 pointer-events-none">
            <span className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-white">Out of Stock</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted pointer-events-none" />}
        
      </div>
      
      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-medium text-primary uppercase tracking-wide">{product.category}</p>
        <h3 
          className="mt-1.5 font-semibold text-foreground line-clamp-2 text-sm group-hover:text-primary transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-foreground">BDT {discountedPrice.toLocaleString()}</span>
          {product.discount > 0 && <span className="text-sm text-muted-foreground line-through">BDT {product.price.toLocaleString()}</span>}
        </div>
        
        {/* Action Buttons - Black/White Theme */}
        <div className="mt-4 flex flex-col gap-2 relative z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-foreground bg-background py-3 text-sm font-bold uppercase tracking-wide text-foreground disabled:opacity-50 active:scale-[0.98] transition-all duration-200 touch-manipulation select-none hover:bg-secondary"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            ADD TO CART
          </button>
          <button
            type="button"
            onClick={handleOrder}
            disabled={!product.stock}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-bold uppercase tracking-wide text-background disabled:opacity-50 active:scale-[0.98] transition-all duration-200 touch-manipulation select-none hover:bg-foreground/90"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
