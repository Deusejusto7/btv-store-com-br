CREATE TYPE public.order_status AS ENUM ('pendente', 'confirmado', 'pago', 'enviado', 'entregue', 'cancelado');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Produtos
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tier text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL CHECK (price_cents > 0),
  max_installments integer NOT NULL DEFAULT 10 CHECK (max_installments BETWEEN 1 AND 12),
  features text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos ativos são públicos" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Clientes
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pedidos
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number bigint GENERATED ALWAYS AS IDENTITY (START WITH 1001) UNIQUE,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status public.order_status NOT NULL DEFAULT 'pendente',
  payment_method text NOT NULL DEFAULT 'whatsapp',
  subtotal_cents integer NOT NULL CHECK (subtotal_cents >= 0),
  shipping_cents integer NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  shipping_cep text NOT NULL,
  shipping_street text NOT NULL,
  shipping_number text NOT NULL,
  shipping_complement text,
  shipping_neighborhood text NOT NULL,
  shipping_city text NOT NULL,
  shipping_state text NOT NULL,
  notes text,
  accepted_terms_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Itens do pedido
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents > 0),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  line_total_cents integer NOT NULL CHECK (line_total_cents > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

INSERT INTO public.products (slug, name, tier, description, price_cents, max_installments, features, is_featured, sort_order) VALUES
  ('btv-stick-lite', 'BTV Stick Lite', 'LITE', 'Entrada ideal para transformar sua TV em Smart TV com imagem Full HD.', 19990, 10, ARRAY['Full HD 1080p','Wi‑Fi 2.4GHz','Controle remoto'], false, 1),
  ('btv-stick-4k', 'BTV Stick 4K', '4K', 'O mais vendido: imagem Ultra HD 4K HDR e controle por voz.', 29990, 10, ARRAY['Ultra HD 4K HDR','Wi‑Fi dual band','Controle por voz'], true, 2),
  ('btv-stick-4k-max', 'BTV Stick 4K Max', 'MAX', 'Desempenho máximo com HDR10+, Wi‑Fi 6 e Bluetooth.', 39990, 10, ARRAY['4K HDR10+','Wi‑Fi 6','Bluetooth 5.0 + voz'], false, 3);