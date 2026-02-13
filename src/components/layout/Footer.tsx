import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Horas</h3>
            <p className="text-sm text-muted-foreground">
              Fresh fashion at modern vibes. Discover our curated collection of premium streetwear and contemporary fashion.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/shop" className="hover:text-foreground transition-colors">New Arrivals</Link>
              <Link to="/shop" className="hover:text-foreground transition-colors">Men</Link>
              <Link to="/shop" className="hover:text-foreground transition-colors">Collection</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <span>Contact</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>FAQ</span>
              <span>Shipping & Returns</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <span>© 2026 Horas. All rights reserved.</span>
          <Link to="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
