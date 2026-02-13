import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  sizes: string[];
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Japan Green Outer",
    description: "Premium oversized hoodie crafted from soft organic cotton. Features a relaxed fit with ribbed cuffs and hem. Perfect for layering or wearing solo.",
    price: 399000,
    image: product1,
    images: [product1, product1, product1],
    category: "Hoodies",
    brand: "Wink",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 41,
  },
  {
    id: "2",
    name: "Black to Basic Tee",
    description: "Minimalist oversized t-shirt in deep black. Made from 100% premium cotton with a clean silhouette.",
    price: 150000,
    image: product2,
    images: [product2, product2, product2],
    category: "T-Shirts",
    brand: "Wink",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: "3",
    name: "Soft Hoodie",
    description: "Classic beige jacket with a modern twist. Water-resistant outer shell with warm inner lining.",
    price: 250000,
    image: product3,
    images: [product3, product3, product3],
    category: "Jackets",
    brand: "Adidas",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviewCount: 35,
  },
  {
    id: "4",
    name: "White Off Hoodie",
    description: "Pure white premium hoodie with minimal branding. Ultra-soft fleece lining for maximum comfort.",
    price: 350000,
    discount: 15,
    image: product4,
    images: [product4, product4, product4],
    category: "Hoodies",
    brand: "Nike",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewCount: 22,
  },
  {
    id: "5",
    name: "Navy Knit Sweater",
    description: "Fine-knit navy sweater in a timeless design. Perfect for smart casual occasions.",
    price: 280000,
    image: product5,
    images: [product5, product5, product5],
    category: "Sweaters",
    brand: "Zara",
    sizes: ["S", "M", "L"],
    rating: 4.5,
    reviewCount: 19,
  },
  {
    id: "6",
    name: "Dreamy Brown Coat",
    description: "Elegant trench coat in rich brown tone. Double-breasted design with belt for a polished look.",
    price: 550000,
    discount: 10,
    image: product6,
    images: [product6, product6, product6],
    category: "Jackets",
    brand: "Zara",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 47,
  },
];

export const categories = ["Hoodies", "T-Shirts", "Jackets", "Sweaters", "Sneakers", "Boots"];
export const brands = ["Wink", "Adidas", "Nike", "Zara", "Dickies", "Vans", "Uniqlo"];

export function formatPrice(price: number): string {
  return `EGP ${price.toLocaleString("en-EG")}`;
}

export function getDiscountedPrice(price: number, discount?: number): number {
  if (!discount) return price;
  return price - (price * discount) / 100;
}
