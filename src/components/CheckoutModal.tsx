import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { submitOrder } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "shipping" | "payment" | "success";

interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-3 sm:p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-card rounded-xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "", phone: "", email: "", city: "", address: "", notes: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [orderId] = useState(() => `WNK-${Date.now().toString(36).toUpperCase()}`);

  const handleShippingSubmit = () => {
    if (!shipping.fullName || !shipping.phone || !shipping.email || !shipping.city || !shipping.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(shipping.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setStep("payment");
  };

  const handlePaymentConfirm = async () => {
    if (!screenshot) {
      toast.error("Please upload your payment confirmation screenshot");
      return;
    }
    setSubmitting(true);
    try {
      await submitOrder(shipping, items, totalPrice, screenshot, orderId);
      setStep("success");
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("shipping");
    setShipping({ fullName: "", phone: "", email: "", city: "", address: "", notes: "" });
    setScreenshot(null);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <Overlay onClose={step === "success" ? handleClose : () => {}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {step === "shipping" && "Shipping Information"}
            {step === "payment" && "Payment Confirmation"}
            {step === "success" && "Order Confirmed!"}
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {step === "shipping" && (
          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
              <div>
                <Label>Phone *</Label>
                <Input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+20 122..." />
              </div>
              <div>
                <Label>Email *</Label>
                <Input value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} placeholder="email@example.com" type="email" />
              </div>
            </div>
            <div>
              <Label>City *</Label>
              <Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Cairo" />
            </div>
            <div>
              <Label>Full Address *</Label>
              <Textarea value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Street, building, apt..." />
            </div>
            <div>
              <Label>Extra Notes</Label>
              <Textarea value={shipping.notes} onChange={(e) => setShipping({ ...shipping, notes: e.target.value })} placeholder="Any special instructions..." />
            </div>
            <Button className="w-full touch-manipulation" size="lg" onClick={handleShippingSubmit}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-medium mb-2">Order Summary</h3>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity} ({item.size})</span>
                  <span>{formatPrice(
                    (item.product.discount
                      ? item.product.price - (item.product.price * item.product.discount) / 100
                      : item.product.price) * item.quantity
                  )}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium mb-1">Pay via Cash Wallet</p>
              <p className="text-sm text-muted-foreground mb-2">Send payment to:</p>
              <div className="flex items-center gap-2">
                <code className="bg-card px-3 py-1.5 rounded-lg text-sm font-mono select-all">+20 122357495</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("+201222357495");
                    toast.success("Number copied!");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <Label>Upload Payment Screenshot *</Label>
              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-foreground/30 transition-colors">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {screenshot ? screenshot.name : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <Button className="w-full touch-manipulation" size="lg" onClick={handlePaymentConfirm} disabled={submitting}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Confirm Payment"}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-4 py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle size={64} className="mx-auto text-success" />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Payment received. We will contact you soon to confirm your order and start the shipping process.
            </p>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Order Reference</p>
              <p className="text-lg font-semibold font-mono">{orderId}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Continue Shopping
            </Button>
          </div>
        )}
      </Overlay>
    </AnimatePresence>
  );
}
