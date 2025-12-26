import { Link, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { getJerseyImage } from '@/assets/jerseys';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/order', {
      state: {
        cartItems: items,
        fromCart: true,
      },
    });
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background pb-32 md:pb-12">
        <SEO title="Shopping Cart | JerseyHub" description="Review your cart" />

        <main className="container py-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-6">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Your cart is empty</h3>
              <p className="mt-2 text-muted-foreground mb-6">
                Add some jerseys to get started
              </p>
              <Button onClick={() => navigate('/')} className="btn-primary">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const discountedPrice =
                    item.product.price * (1 - item.product.discount / 100);
                  const itemTotal = discountedPrice * item.quantity;
                  const productImage = getJerseyImage(item.product.id, item.product.image);

                  return (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="card-elevated p-4 flex gap-4 animate-slide-up"
                    >
                      <Link to={`/product/${item.product.id}`}>
                        <img
                          src={productImage}
                          alt={item.product.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: <span className="font-medium text-foreground">{item.size}</span>
                        </p>
                        <p className="text-primary font-bold mt-1">
                          ৳{discountedPrice.toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors text-foreground"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors text-foreground"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ৳{itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-destructive hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary - Desktop */}
              <div className="hidden lg:block">
                <div className="card-elevated p-6 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="text-foreground">৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-success">Free</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">৳{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full mt-6 btn-primary gap-2"
                    size="lg"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 p-3 rounded-xl bg-success/10 border border-success/20 text-center">
                    <p className="text-xs text-success font-medium">
                      💵 Cash on Delivery Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Sticky Bottom Bar */}
        {items.length > 0 && (
          <div className="lg:hidden sticky-bottom-bar p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary">
                ৳{totalPrice.toLocaleString()}
              </span>
            </div>
            <Button
              type="button"
              onClick={handleCheckout}
              className="w-full btn-primary gap-2"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5" />
              Checkout ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </Button>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default CartPage;
