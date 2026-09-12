CREATE TABLE public.flow_overrides (
  slug TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.flow_overrides TO anon;
GRANT SELECT ON public.flow_overrides TO authenticated;
GRANT ALL ON public.flow_overrides TO service_role;

ALTER TABLE public.flow_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode ver overrides"
ON public.flow_overrides FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_flow_overrides_updated_at
BEFORE UPDATE ON public.flow_overrides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();