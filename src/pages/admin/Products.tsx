import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Loader2, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: string;
  discount: string;
  image: File | null;
  isNewArrival: boolean;
}

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  discount: number | null;
  image_url: string | null;
  is_new_arrival: boolean;
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useAdminProducts();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "", description: "", category: "", price: "", discount: "", image: null, isNewArrival: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to delete"),
  });

  const createMutation = useMutation({
    mutationFn: async (f: ProductForm) => {
      let imageUrl = "/placeholder.svg";
      if (f.image) {
        const ext = f.image.name.split(".").pop() || "jpg";
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, f.image);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("products").insert({
        name: f.name,
        description: f.description,
        category: f.category,
        price: parseInt(f.price) || 0,
        discount: parseInt(f.discount) || 0,
        image_url: imageUrl,
        images: [imageUrl],
        is_new_arrival: f.isNewArrival,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowModal(false);
      setForm({ name: "", description: "", category: "", price: "", discount: "", image: null, isNewArrival: false });
      toast.success("Product added");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to add product"),
  });

  const toggleNewArrivalMutation = useMutation({
    mutationFn: async ({ id, isNewArrival }: { id: string; isNewArrival: boolean }) => {
      const { error } = await supabase
        .from("products")
        .update({ is_new_arrival: isNewArrival })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to update"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error("Fill in required fields"); return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Products</h2>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">Loading…</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 font-medium text-muted-foreground">Image</th>
                <th className="p-3 font-medium text-muted-foreground">Name</th>
                <th className="p-3 font-medium text-muted-foreground">Category</th>
                <th className="p-3 font-medium text-muted-foreground">Price</th>
                <th className="p-3 font-medium text-muted-foreground">Discount</th>
                <th className="p-3 font-medium text-muted-foreground">New arrival</th>
                <th className="p-3 font-medium text-muted-foreground w-12"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: ProductRow) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <img src={p.image_url || "/placeholder.svg"} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.discount ? `${p.discount}%` : "–"}</td>
                  <td className="p-3">
                    <Switch
                      checked={p.is_new_arrival ?? false}
                      onCheckedChange={(checked) =>
                        toggleNewArrivalMutation.mutate({ id: p.id, isNewArrival: !!checked })
                      }
                      disabled={toggleNewArrivalMutation.isPending}
                      aria-label={`Mark ${p.name} as new arrival`}
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteMutation.mutate(p.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      disabled={deleteMutation.isPending}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Product</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Hoodies" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Price (EGP) *</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Discount %</Label>
                    <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Product Image</Label>
                  <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-foreground/30 transition-colors">
                    <Upload size={24} className="text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {form.image ? form.image.name : "Click to upload"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <Label>Show on New Arrivals</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Feature this product on the New Arrivals page</p>
                  </div>
                  <Switch
                    checked={form.isNewArrival}
                    onCheckedChange={(checked) => setForm({ ...form, isNewArrival: !!checked })}
                    aria-label="Show on New Arrivals page"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Product"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
