import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import heroImage from "@/assets/hero-1.jpg";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    image: heroImage,
    title: "King Horas.",
    subtitle: "Discover our wide ranging and timeless of lifestyle products. Pick your favourite stuff that matches your personal taste, style and suits your style.",
  },
];

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = heroSlides[slideIndex];
  const { data: products = [], isLoading } = useProducts();

  return (
    <div>
      {/* Hero */}
      <section className="container-page py-4 sm:py-6">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[280px] min-[400px]:h-[340px] sm:h-[380px] md:h-[500px]">
          <motion.img
            key={slideIndex}
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-14 max-w-xl">
            <motion.h1
              className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-bold text-card mb-2 sm:mb-4 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-card/80 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 max-w-sm line-clamp-3 sm:line-clamp-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {slide.subtitle}
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/shop" className="touch-manipulation">
                <Button variant="secondary" size="lg" className="rounded-full gap-2 text-sm sm:text-base h-10 sm:h-11">
                  Start shopping <ArrowUpRight size={16} />
                </Button>
              </Link>
              <span className="text-card/70 text-xs sm:text-sm">Top Collection</span>
            </motion.div>
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2">
            <button
              onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
              className="w-9 h-9 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-card hover:bg-card/40 transition-colors touch-manipulation"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSlideIndex(Math.min(heroSlides.length - 1, slideIndex + 1))}
              className="w-9 h-9 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-card hover:bg-card/40 transition-colors touch-manipulation"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Fresh Fashion */}
      <section className="container-page py-8 sm:py-12 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Fresh Fashion at Modern Vibes
        </motion.h2>
        <motion.p
          className="text-muted-foreground max-w-xl mx-auto text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Our collection is constantly updated with the latest styles, ensuring you're always on point. Shop now and let your fashion sense shine with the newest arrivals at Wink.
        </motion.p>
      </section>

      {/* Collections Grid */}
      <section className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <motion.div
            className="rounded-xl sm:rounded-2xl overflow-hidden relative h-[240px] sm:h-[320px] md:h-[380px]"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src={collection1} alt="Collection" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <h3 className="text-card text-base sm:text-xl font-semibold">Discover the unlimitless</h3>
              <p className="text-card/70 text-xs sm:text-sm">Imagining New Fashion Trends</p>
            </div>
          </motion.div>
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-8 min-h-[140px] sm:h-[180px] flex flex-col justify-center">
              <h3 className="text-lg sm:text-2xl font-semibold italic mb-1">Hold on, new product is coming!</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Bringing you a new era of viral clothes.</p>
            </div>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden relative h-[140px] sm:h-[180px]">
              <img src={collection2} alt="New Arrivals" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-card rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="text-lg sm:text-xl font-bold">2026</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground">New Arrival Cloth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browse All */}
      <section className="container-page py-10 sm:py-16">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6 sm:mb-10 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Browse All You Need.
        </motion.h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {products.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
        <div className="text-center mt-6 sm:mt-10">
          <Link to="/shop" className="touch-manipulation">
            <Button size="lg" className="rounded-full px-6 sm:px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
