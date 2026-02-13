import { motion } from "framer-motion";
import aboutHero from "@/assets/about-hero.jpg";
import collection1 from "@/assets/collection-1.jpg";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const sections = [
  { id: "story", title: "Our Story" },
  { id: "why", title: "Why We Started" },
  { id: "how", title: "How It Works" },
  { id: "different", title: "What Makes Us Different" },
  { id: "vision", title: "Our Vision & Values" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="container-page py-4 sm:py-6">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[220px] sm:h-[300px] md:h-[400px]">
          <img src={aboutHero} alt="About Wink" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
      </section>

      <div className="container-page py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
          {/* Main content */}
          <motion.article
            className="prose prose-sm max-w-none min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">The Horas Story: Redefining Modern Fashion</h1>
            <p className="text-xs text-muted-foreground mb-6 sm:mb-8">12 Feburary 2026</p>

            <section id="story" className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                In a competitive landscape, a compelling value proposition is your ticket to success. Clearly articulate what sets your digital agency apart from the rest. Whether it's unmatched creativity, a unique approach, or exceptional customer service, make sure your value proposition resonates with your target audience.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We started Wink with a simple belief: fashion should be accessible, sustainable, and beautiful. Every piece in our collection tells a story — from the carefully sourced fabrics to the artisan craftsmanship that brings each design to life.
              </p>
            </section>

            <section id="why" className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Why We Started</h2>
              <p className="text-muted-foreground leading-relaxed">
                We saw a gap in the market for truly premium yet affordable streetwear. The fashion industry was divided between fast fashion and luxury — we wanted to create something in between. Quality fabrics, ethical production, and timeless designs at fair prices.
              </p>
            </section>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden my-6 sm:my-8 h-[200px] sm:h-[260px]">
              <img src={collection1} alt="Fashion" className="w-full h-full object-cover" />
            </div>

            <section id="how" className="mb-10">
              <h2 className="text-xl font-semibold mb-3">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed">
                We work directly with manufacturers and artisans around the world to bring you the finest materials and craftsmanship. By cutting out middlemen, we offer premium quality at prices that make sense. Each product goes through rigorous quality checks before reaching you.
              </p>
            </section>

            <section id="different" className="mb-10">
              <h2 className="text-xl font-semibold mb-3">What Makes Us Different</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to sustainability sets us apart. We use organic cotton, recycled materials, and eco-friendly dyes whenever possible. Our packaging is 100% recyclable, and we offset our carbon footprint with every order. Fashion that looks good and does good.
              </p>
            </section>

            <section id="vision" className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Our Vision & Values</h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where style and sustainability go hand in hand. Our core values — quality, transparency, and community — guide everything we do. From our design process to our customer service, we strive to create an experience that inspires confidence and joy.
              </p>
            </section>
          </motion.article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-3">Navigate</h3>
                <nav className="space-y-2">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Featured products */}
      <section className="container-page py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8 px-2">Featured Products from Our Story</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
