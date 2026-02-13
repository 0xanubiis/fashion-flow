import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ["admin-order-detail", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useAdminOrders();
  const [viewOrder, setViewOrder] = useState<any>(null);
  const { data: orderItems } = useOrderDetail(viewOrder?.id);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Status updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Orders</h2>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">No orders yet</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 font-medium text-muted-foreground">Ref</th>
                <th className="p-3 font-medium text-muted-foreground">Customer</th>
                <th className="p-3 font-medium text-muted-foreground">Amount</th>
                <th className="p-3 font-medium text-muted-foreground">Status</th>
                <th className="p-3 font-medium text-muted-foreground">Date</th>
                <th className="p-3 font-medium text-muted-foreground w-12"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs">{o.order_ref}</td>
                  <td className="p-3">
                    <div className="font-medium">{o.full_name}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="p-3 font-medium">{formatPrice(o.total_amount)}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => statusMutation.mutate({ id: o.id, status: e.target.value })}
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[o.status] || ""}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button onClick={() => setViewOrder(o)} className="text-muted-foreground hover:text-foreground p-1">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4"
          onClick={() => setViewOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order: {viewOrder.order_ref}</h3>
              <button onClick={() => setViewOrder(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4 space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {viewOrder.full_name}</p>
                <p><span className="font-medium">Phone:</span> {viewOrder.phone}</p>
                <p><span className="font-medium">Email:</span> {viewOrder.email}</p>
                <p><span className="font-medium">City:</span> {viewOrder.city}</p>
                <p><span className="font-medium">Address:</span> {viewOrder.address}</p>
                {viewOrder.notes && <p><span className="font-medium">Notes:</span> {viewOrder.notes}</p>}
              </div>

              {viewOrder.payment_screenshot_url && (
                <div>
                  <p className="text-sm font-medium mb-2">Payment Screenshot</p>
                  <img src={viewOrder.payment_screenshot_url} alt="Payment" className="rounded-xl max-h-48 object-contain border border-border" />
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Order Items</p>
                {orderItems ? (
                  <div className="space-y-2">
                    {orderItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm bg-muted rounded-lg p-3">
                        <span>{item.product_name} × {item.quantity} ({item.size})</span>
                        <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading items…</p>
                )}
              </div>

              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(viewOrder.total_amount)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
