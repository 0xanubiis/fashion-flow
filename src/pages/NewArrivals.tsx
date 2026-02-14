import { useNewArrivalProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-1.jpg";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function NewArrivalsPage() {
  const { data: products = [], isLoading, error, refetch } = useNewArrivalProducts();

  return (
    <div>
      <section className="container-page py-4 sm:py-6">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[160px] sm:h-[200px] md:h-[260px]">
          <img src={heroImage} alt="New Arrivals" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/50 to-transparent" />
          <div className="absolute left-4 right-4 sm:left-auto sm:right-8 top-1/2 -translate-y-1/2 text-left sm:text-right">
            <p className="text-card/70 text-xs mb-1">· New Arrivals</p>
            <h1 className="text-card text-lg sm:text-2xl md:text-3xl font-semibold max-w-xs">
              Just Dropped — Latest Picks from Horas
            </h1>
          </div>
        </div>
      </section>

      <div className="container-page py-4 sm:py-6">
        <nav className="text-xs text-muted-foreground mb-2 truncate" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">&gt;</span>
          <span>New Arrivals</span>
        </nav>
        <h2 className="text-xl sm:text-2xl font-semibold truncate min-w-0 mb-4 sm:mb-6">
          New Arrivals
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-20">
            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="text-muted-foreground">Unable to load new arrivals. Please try again.</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-muted-foreground mb-4">No new arrivals right now.</p>
            <Link
              to="/shop"
              className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Browse full collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
