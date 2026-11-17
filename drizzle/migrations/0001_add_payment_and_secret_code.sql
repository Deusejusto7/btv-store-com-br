ALTER TABLE public.orders
  ADD COLUMN mp_preference_id text,
  ADD COLUMN mp_payment_id text,
  ADD COLUMN payment_status_detail text,
  ADD COLUMN paid_at timestamptz,
  ADD COLUMN secret_code text UNIQUE;

CREATE OR REPLACE FUNCTION public.assign_order_secret_code()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  raw text;
BEGIN
  IF NEW.status IN ('pago', 'enviado', 'entregue') AND NEW.secret_code IS NULL THEN
    raw := upper(replace(gen_random_uuid()::text, '-', ''));
    NEW.secret_code := 'BTV-' || substr(raw, 1, 4) || '-' || substr(raw, 5, 4) || '-' || substr(raw, 9, 4);
    IF NEW.paid_at IS NULL THEN
      NEW.paid_at := now();
    END IF;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.secret_code IS NOT NULL THEN
    NEW.secret_code := OLD.secret_code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_assign_secret_code
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.assign_order_secret_code();

CREATE INDEX orders_mp_payment_id_idx ON public.orders(mp_payment_id);