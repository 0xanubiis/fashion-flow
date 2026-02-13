import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Product, formatPrice, getDiscountedPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.sizes[0]);
    toast.success(`${product.name} added to cart`);
  };

  const discountedPrice = getDiscountedPrice(product.price, product.discount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="min-w-0"
    >
      <Link to={`/product/${product.id}`} className="group block" tabIndex={0}>
        <div className="relative bg-card rounded-lg sm:rounded-xl overflow-hidden aspect-[3/4]">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {product.discount && (
            <span className="absolute top-3 left-3 bg-yellow-500 text-badge-sale-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="mt-2 sm:mt-3 space-y-1 min-w-0">
          <h3 className="font-medium text-xs sm:text-sm line-clamp-2">{product.name}</h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{product.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-1 pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full truncate">
                {formatPrice(discountedPrice)}
              </span>
              {product.discount && (
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through shrink-0">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                className="text-muted-foreground hover:text-foreground transition-colors p-1 touch-manipulation"
                aria-label="Wishlist"
                onClick={(e) => e.preventDefault()}
              >
                <Heart size={14} className="sm:w-4 sm:h-4" />
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors p-1 touch-manipulation"
                aria-label="Add to cart"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
