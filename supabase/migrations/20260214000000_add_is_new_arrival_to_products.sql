-- Add is_new_arrival flag so admins can feature products on the New Arrivals page
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.products.is_new_arrival IS 'When true, product appears on the New Arrivals page.';
