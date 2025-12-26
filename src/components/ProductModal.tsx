import { useState } from 'react';
import { X, Minus, Plus, Share2, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder: (product: Product, size: string, quantity: number) => void;
}

const ProductModal = ({ product, isOpen, onClose, onOrder }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discount / 100);
  const totalPrice = discountedPrice * quantity;

  const handleOrder = () => {
    if (!selectedSize) return;
    onOrder(product, selectedSize, quantity);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this ${product.name}!`);

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

      {/* Modal */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="mx-4 max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
              {product.discount > 0 && (
                <span className="badge-discount">-{product.discount}%</span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category */}
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                {product.category}
              </p>

              {/* Name */}
              <h2 className="mt-2 font-display text-2xl md:text-3xl text-foreground">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">
                  ৳{discountedPrice.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                <span
                  className={cn(
                    'badge-stock',
                    product.stock ? 'in-stock' : 'out-of-stock'
                  )}
                >
                  {product.stock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[48px] rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-secondary text-foreground hover:border-primary'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-center justify-between rounded-lg bg-secondary p-4">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ৳{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Order Button */}
              <Button
                variant="gold"
                size="lg"
                className="mt-6"
                onClick={handleOrder}
                disabled={!product.stock || !selectedSize}
              >
                {!selectedSize ? 'Select a Size' : 'Place Order (Cash on Delivery)'}
              </Button>

              {/* Share */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Share:</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
