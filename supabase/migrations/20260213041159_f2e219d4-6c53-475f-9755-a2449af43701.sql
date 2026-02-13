
-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Wink',
  sizes TEXT[] DEFAULT '{S,M,L,XL}',
  rating NUMERIC(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = check_user_id);
$$;

CREATE POLICY "Admins can read admin_users" ON public.admin_users FOR SELECT USING (public.is_admin(auth.uid()));

-- Admin policies for products
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.is_admin(auth.uid()));

-- Orders table (guest orders, no user_id required)
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_screenshot_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (guest checkout)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
-- Only admins can view/update orders
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin(auth.uid()));

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view order_items" ON public.order_items FOR SELECT USING (public.is_admin(auth.uid()));

-- Storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);
CREATE POLICY "Anyone can upload payment screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');
CREATE POLICY "Anyone can view payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots');

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
CREATE POLICY "Anyone can view product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Anyone can read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
