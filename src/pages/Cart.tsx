import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getDiscountedPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/CheckoutModal";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-page py-12 sm:py-20 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
          <h1 className="text-xl sm:text-2xl font-semibold">Your cart is empty</h1>
          <p className="text-muted-foreground text-sm">Add some items to get started.</p>
          <Link to="/shop" className="touch-manipulation inline-block">
            <Button className="rounded-full mt-4">Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-page py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 min-w-0">
          {items.map((item, i) => {
            const price = getDiscountedPrice(item.product.price, item.product.discount);
            return (
              <motion.div
                key={`${item.product.id}-${item.size}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <img src={item.product.image} alt={item.product.name} className="w-full sm:w-24 h-48 sm:h-28 object-cover rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted touch-manipulation shrink-0"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted touch-manipulation shrink-0"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">{formatPrice(price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors touch-manipulation p-1"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 h-fit space-y-4 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order Summary</h2>
          {items.map((item) => {
            const price = getDiscountedPrice(item.product.price, item.product.discount);
            return (
              <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(price * item.quantity)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <Button className="w-full rounded-xl touch-manipulation" size="lg" onClick={() => setCheckoutOpen(true)}>
            Proceed to Checkout
          </Button>
        </div>
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
