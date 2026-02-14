import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navCategories = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collection", href: "/shop" },
];


const navLinks = [
{ label: "Men", href: "/shop" },
{ label: "About", href: "/about" }];


export default function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container-page">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 min-h-[3.5rem]">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 -ml-1 min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center touch-manipulation"
            aria-label="Menu">

            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="text-xl sm:text-2xl font-semibold tracking-wider truncate">
            Horas
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/shop" className="p-2 sm:p-0 touch-manipulation" aria-label="Search">
              <Search size={20} className="text-foreground sm:w-5 sm:h-5" />
            </Link>
            <Link to="/cart" className="relative p-2 sm:p-0 touch-manipulation" aria-label="Cart">
              <ShoppingBag size={20} className="text-foreground sm:w-5 sm:h-5" />
              {totalItems > 0 &&
              <span className="absolute top-0 right-0 sm:-top-2 sm:-right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              }
            </Link>
          </div>
        </div>

        {/* Desktop sub-nav */}
        <nav className="hidden lg:flex items-center gap-6 pb-3 text-sm">
          {navCategories.map((c) =>
          <Link key={c.label} to={c.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {c.label}
            </Link>
          )}
          <div className="flex-1" />
          {navLinks.map((l) =>
          <Link key={l.label} to={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden overflow-hidden bg-card border-t border-border">

            <nav className="container-page py-4 flex flex-col gap-3">
              {[...navCategories, ...navLinks].map((l) =>
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">

                  {l.label}
                </Link>
            )}
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}