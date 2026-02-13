import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { brands, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import heroImage from "@/assets/hero-1.jpg";
import { Filter, X } from "lucide-react";

export default function ShopPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 600000]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  }, [products, selectedBrands, selectedCategories, priceRange]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return counts;
  }, [products]);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-sm mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => toggleBrand(b)} />
              <span className="flex-1">{b}</span>
              <span className="text-xs text-muted-foreground">{brandCounts[b] || 0}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedCategories.includes(c)} onCheckedChange={() => toggleCategory(c)} />
              <span className="flex-1">{c}</span>
              <span className="text-xs text-muted-foreground">{catCounts[c] || 0}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Price</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={600000} step={10000} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <section className="container-page py-4 sm:py-6">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[160px] sm:h-[200px] md:h-[260px]">
          <img src={heroImage} alt="Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/50 to-transparent" />
          <div className="absolute left-4 right-4 sm:left-auto sm:right-8 top-1/2 -translate-y-1/2 text-left sm:text-right">
            <p className="text-card/70 text-xs mb-1">· Collections</p>
            <h1 className="text-card text-lg sm:text-2xl md:text-3xl font-semibold max-w-xs">
              Explore The Various Collection of Horas Collection
            </h1>
          </div>
        </div>
      </section>

      <div className="container-page py-4 sm:py-6">
        <p className="text-xs text-muted-foreground mb-2 truncate">Home &gt; Wink Collection</p>
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold truncate min-w-0">Horas Collection</h2>
          <button
            className="lg:hidden flex items-center gap-1 text-sm shrink-0 touch-manipulation py-2 px-1"
            onClick={() => setShowFilters(!showFilters)}
            type="button"
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />} Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar />
          </aside>
          {showFilters && (
            <motion.aside
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="lg:hidden w-full bg-card rounded-xl p-4 border border-border"
            >
              <FilterSidebar />
            </motion.aside>
          )}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 sm:py-20">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
