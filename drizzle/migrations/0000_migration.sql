CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  plan text NOT NULL DEFAULT 'free',
  generation_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE TABLE public.qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  content text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.qr_codes TO authenticated;
GRANT ALL ON public.qr_codes TO service_role;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own qr read" ON public.qr_codes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own qr delete" ON public.qr_codes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic, server-enforced generation: checks limit, increments, saves code.
CREATE OR REPLACE FUNCTION public.record_generation(_kind text, _content text, _label text, _limit integer)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.profiles; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  INSERT INTO public.profiles (id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO p FROM public.profiles WHERE id = uid FOR UPDATE;
  IF p.plan <> 'pro' AND p.generation_count >= _limit THEN
    RETURN json_build_object('ok', false, 'count', p.generation_count, 'plan', p.plan);
  END IF;
  UPDATE public.profiles SET generation_count = generation_count + 1 WHERE id = uid;
  INSERT INTO public.qr_codes (user_id, kind, content, label) VALUES (uid, _kind, left(_content, 4000), left(_label, 200));
  RETURN json_build_object('ok', true, 'count', p.generation_count + 1, 'plan', p.plan);
END $$;
REVOKE EXECUTE ON FUNCTION public.record_generation(text, text, text, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.record_generation(text, text, text, integer) TO authenticated;