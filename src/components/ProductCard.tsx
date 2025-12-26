import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, ShoppingBag } from 'lucide-react';
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <article className="group card-interactive overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {product.discount > 0 && <div className="badge-discount">-{product.discount}%</div>}
          {!product.stock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <span className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-white">Out of Stock</span>
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn('h-full w-full object-cover transition-transform duration-500 group-hover:scale-110', imageLoaded ? 'opacity-100' : 'opacity-0')}
          />
          {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
          
          {/* Hover Actions */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex gap-2 p-3 bg-gradient-to-t from-background/95 to-transparent pt-8">
              <button 
                type="button" 
                onClick={handleQuickView} 
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Eye className="h-4 w-4" strokeWidth={2} />
                <span>View</span>
              </button>
              <button 
                type="button" 
                onClick={handleAddToCart} 
                disabled={!product.stock} 
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <p className="text-xs font-medium text-primary uppercase tracking-wide">{product.category}</p>
        <h3 className="mt-1.5 font-semibold text-foreground line-clamp-2 text-sm group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">৳{discountedPrice.toLocaleString()}</span>
          {product.discount > 0 && <span className="text-sm text-muted-foreground line-through">৳{product.price.toLocaleString()}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <span key={size} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">{size}</span>
          ))}
          {product.sizes.length > 4 && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">+{product.sizes.length - 4}</span>}
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="mt-4 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleOrder}
            disabled={!product.stock}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2} />
            Order
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
