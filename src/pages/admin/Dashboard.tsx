import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from "recharts";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, status, total_amount, created_at");
      if (error) throw error;

      const total = orders.length;
      const pending = orders.filter((o) => o.status === "Pending").length;
      const completed = orders.filter((o) => o.status === "Completed").length;
      const rejected = orders.filter((o) => o.status === "Rejected").length;
      const revenue = orders
        .filter((o) => o.status === "Completed")
        .reduce((sum, o) => sum + o.total_amount, 0);
      const avgOrder = completed > 0 ? revenue / completed : 0;

      return { total, pending, completed, rejected, revenue, avgOrder, orders };
    },
  });
}

function useOrderItems() {
  return useQuery({
    queryKey: ["admin-order-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("product_name, quantity");
      if (error) throw error;
      return data;
    },
  });
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(0 84% 60%)"];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: orderItems } = useOrderItems();

  if (isLoading || !stats) {
    return <div className="animate-pulse text-muted-foreground py-10 text-center">Loading dashboard…</div>;
  }

  const statCards = [
    { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-foreground" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-destructive" },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: DollarSign, color: "text-emerald-500" },
    { label: "Avg Order", value: formatPrice(stats.avgOrder), icon: TrendingUp, color: "text-foreground" },
  ];

  // Orders over time (by day)
  const ordersByDay: Record<string, number> = {};
  const revenueByDay: Record<string, number> = {};
  stats.orders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    ordersByDay[day] = (ordersByDay[day] || 0) + 1;
    if (o.status === "Completed") {
      revenueByDay[day] = (revenueByDay[day] || 0) + o.total_amount;
    }
  });
  const ordersOverTime = Object.entries(ordersByDay).map(([day, count]) => ({ day, count }));
  const revenueOverTime = Object.entries(revenueByDay).map(([day, amount]) => ({ day, amount }));

  // Status distribution
  const statusData = [
    { name: "Pending", value: stats.pending },
    { name: "Completed", value: stats.completed },
    { name: "Rejected", value: stats.rejected },
  ].filter((d) => d.value > 0);

  // Top products
  const productMap: Record<string, number> = {};
  orderItems?.forEach((item) => {
    productMap[item.product_name] = (productMap[item.product_name] || 0) + item.quantity;
  });
  const topProducts = Object.entries(productMap)
    .map(([name, qty]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={16} className={s.color} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-lg font-bold truncate">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders over time */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Orders Over Time</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            {ordersOverTime.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-20">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersOverTime}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue over time */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenue Over Time</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            {revenueOverTime.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-20">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                  <Area type="monotone" dataKey="amount" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Order Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-20">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Top Selling Products</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-20">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          {stats.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Order Ref</th>
                    <th className="pb-2 font-medium text-muted-foreground">Amount</th>
                    <th className="pb-2 font-medium text-muted-foreground">Status</th>
                    <th className="pb-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.orders.slice(0, 10).map((o) => (
                    <tr key={o.id} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs">{(o as any).order_ref || o.id.slice(0, 8)}</td>
                      <td className="py-2">{formatPrice(o.total_amount)}</td>
                      <td className="py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          o.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                          o.status === "Rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{o.status}</span>
                      </td>
                      <td className="py-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
