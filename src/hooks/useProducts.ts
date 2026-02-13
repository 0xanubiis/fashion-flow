import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  image_url: string | null;
  images: string[] | null;
  category: string;
  brand: string;
  sizes: string[] | null;
  rating: number | null;
  review_count: number | null;
}

function toProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    description: db.description || "",
    price: db.price,
    discount: db.discount || undefined,
    image: db.image_url || "/placeholder.svg",
    images: db.images?.length ? db.images : [db.image_url || "/placeholder.svg"],
    category: db.category,
    brand: db.brand,
    sizes: db.sizes || ["S", "M", "L", "XL"],
    rating: Number(db.rating) || 4.5,
    reviewCount: db.review_count || 0,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbProduct[]).map(toProduct);
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? toProduct(data as DbProduct) : null;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name");
      if (error) throw error;
      return data.map((c) => c.name);
    },
  });
}
