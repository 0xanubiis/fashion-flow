import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, ChevronLeft, Truck, Package, Clock, Calendar } from "lucide-react";
import { formatPrice, getDiscountedPrice } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImageIdx, setMainImageIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-card rounded-2xl aspect-[4/5] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-card rounded animate-pulse w-2/3" />
            <div className="h-6 bg-card rounded animate-pulse w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-sm underline mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize);
    window.location.href = "/cart";
  };

  return (
    <div>
      <div className="container-page py-4 sm:py-6">
        <Link to="/shop" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 sm:mb-6 hover:text-foreground touch-manipulation">
          <ChevronLeft size={14} /> Home &gt; Product details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="min-w-0">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/5] bg-card mb-3">
              <img src={product.images[mainImageIdx]} alt={product.name} className="w-full h-full object-cover" />
              {product.category && (
                <span className="absolute top-4 left-4 bg-card text-foreground text-xs px-3 py-1 rounded-full">{product.category}</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMainImageIdx(i)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-colors ${mainImageIdx === i ? "border-foreground" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="bg-card rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 sm:gap-4 border border-border">
                <span className="text-xl sm:text-2xl font-bold">{formatPrice(discountedPrice)}</span>
                {product.discount && <span className="text-xs sm:text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`min-w-[2.5rem] w-10 h-10 rounded-lg border text-sm font-medium transition-colors touch-manipulation ${selectedSize === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="text-sm font-semibold">Shipping</h3>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Truck size={16} /><span>Free shipping</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Package size={16} /><span>Regular Package</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock size={16} /><span>6-12 Working Days</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar size={16} /><span>Estimated delivery</span></div>
              </div>
            </div>

            <Button className="w-full rounded-xl touch-manipulation" size="lg" onClick={handleAddToCart}>Add to Cart</Button>
          </motion.div>
        </div>
      </div>

      <section className="container-page py-10 sm:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 px-2">More All You Need.</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
