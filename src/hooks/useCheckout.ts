import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

export async function submitOrder(
  shipping: ShippingInfo,
  items: CartItem[],
  totalAmount: number,
  screenshotFile: File,
  orderRef: string
) {
  // 1. Upload screenshot
  const ext = screenshotFile.name.split(".").pop() || "jpg";
  const filePath = `${orderRef}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("payment-screenshots")
    .upload(filePath, screenshotFile, { upsert: true });
  if (uploadError) throw new Error("Failed to upload screenshot: " + uploadError.message);

  const { data: urlData } = supabase.storage
    .from("payment-screenshots")
    .getPublicUrl(filePath);

  // 2. Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_ref: orderRef,
      full_name: shipping.fullName,
      phone: shipping.phone,
      email: shipping.email,
      city: shipping.city,
      address: shipping.address,
      notes: shipping.notes || null,
      total_amount: totalAmount,
      payment_screenshot_url: urlData.publicUrl,
    })
    .select("id")
    .single();
  if (orderError) throw new Error("Failed to create order: " + orderError.message);

  // 3. Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.product.discount
      ? item.product.price - (item.product.price * item.product.discount) / 100
      : item.product.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error("Failed to save order items: " + itemsError.message);

  return order.id;
}
