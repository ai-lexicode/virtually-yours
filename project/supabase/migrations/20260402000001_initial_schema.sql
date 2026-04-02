-- Virtually Yours Database Schema
-- Run this in Supabase SQL Editor to set up the database
-- Based on LexiCode schema, adapted for Virtually Yours (juridisch VA)

-- ============================================================
-- Extensions
-- ============================================================

-- ============================================================
-- Enums
-- ============================================================
create type user_role as enum ('client', 'admin');
create type document_category as enum ('privacy', 'commercieel', 'arbeidsrecht', 'ondernemingsrecht');
create type order_status as enum ('pending', 'paid', 'questionnaire', 'processing', 'review', 'completed', 'cancelled');
create type questionnaire_status as enum ('not_started', 'in_progress', 'completed', 'generating', 'error');
create type generated_doc_status as enum ('generated', 'in_review', 'approved', 'rejected');
create type file_type as enum ('pdf', 'docx');

-- ============================================================
-- Profiles (extends Supabase Auth)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text,
  last_name text,
  email text not null,
  phone text,
  company_name text,
  kvk_number text,
  btw_number text,
  address text,
  postcode text,
  city text,
  role user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Documents (catalog)
-- ============================================================
create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  category document_category not null,
  price_cents integer not null,
  btw_percentage numeric(5,2) not null default 21.00,
  includes text[] not null default '{}',
  estimated_time_minutes integer not null default 15,
  requires_review boolean not null default true,
  docassemble_interview_id text,
  has_docassemble boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Bundles
-- ============================================================
create table bundles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  price_cents integer not null,
  btw_percentage numeric(5,2) not null default 21.00,
  discount_percentage numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bundle_items (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references bundles on delete cascade,
  document_id uuid not null references documents on delete cascade,
  unique (bundle_id, document_id)
);

-- ============================================================
-- Orders
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial unique,
  profile_id uuid not null references profiles on delete cascade,
  status order_status not null default 'pending',
  subtotal_cents integer not null default 0,
  btw_cents integer not null default 0,
  total_cents integer not null default 0,
  mollie_payment_id text,
  payment_method text,
  paid_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  document_id uuid references documents,
  bundle_id uuid references bundles,
  price_cents integer not null,
  btw_cents integer not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Questionnaires
-- ============================================================
create table questionnaires (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items on delete cascade,
  docassemble_session_id text,
  status questionnaire_status not null default 'not_started',
  progress_percentage integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Document Questions (per document type)
-- ============================================================
create table document_questions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents on delete cascade,
  sort_order integer not null default 0,
  question_key text not null,
  question_text text not null,
  question_type text not null default 'text',
  placeholder text,
  options text[],
  is_required boolean not null default true,
  help_text text,
  created_at timestamptz not null default now(),
  unique (document_id, question_key)
);

-- ============================================================
-- Questionnaire Answers (autosave)
-- ============================================================
create table questionnaire_answers (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references questionnaires on delete cascade,
  question_id uuid not null references document_questions on delete cascade,
  answer text,
  saved_at timestamptz not null default now(),
  unique (questionnaire_id, question_id)
);

-- ============================================================
-- Generated Documents
-- ============================================================
create table generated_documents (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items on delete cascade,
  storage_path text not null,
  file_type file_type not null default 'pdf',
  version integer not null default 1,
  status generated_doc_status not null default 'generated',
  reviewer_notes text,
  reviewed_by uuid references profiles,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Invoices
-- ============================================================
create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  invoice_number serial unique,
  storage_path text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Activity Log (admin audit trail)
-- ============================================================
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Security Helper Functions (prevent RLS recursion)
-- Must be created AFTER tables exist
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.owns_order(p_order_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from orders
    where id = p_order_id and profile_id = auth.uid()
  );
$$;

create or replace function public.owns_order_item(p_order_item_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from order_items oi
    join orders o on o.id = oi.order_id
    where oi.id = p_order_item_id and o.profile_id = auth.uid()
  );
$$;

create or replace function public.owns_questionnaire(p_questionnaire_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from questionnaires q
    join order_items oi on oi.id = q.order_item_id
    join orders o on o.id = oi.order_id
    where q.id = p_questionnaire_id and o.profile_id = auth.uid()
  );
$$;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table profiles enable row level security;
alter table documents enable row level security;
alter table bundles enable row level security;
alter table bundle_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table questionnaires enable row level security;
alter table document_questions enable row level security;
alter table questionnaire_answers enable row level security;
alter table generated_documents enable row level security;
alter table invoices enable row level security;
alter table activity_log enable row level security;

-- Profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "Admins can view all profiles" on profiles
  for select using (public.is_admin());
create policy "Admins can update all profiles" on profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- Documents & Bundles: public read
create policy "Anyone can view active documents" on documents
  for select using (is_active = true);
create policy "Anyone can view active bundles" on bundles
  for select using (is_active = true);
create policy "Anyone can view bundle items" on bundle_items
  for select using (true);

-- Document questions: public read
create policy "Anyone can view document questions" on document_questions
  for select using (true);

-- Orders
create policy "Users can view own orders" on orders
  for select using (profile_id = auth.uid());
create policy "Users can insert own orders" on orders
  for insert with check (profile_id = auth.uid());
create policy "Admins can view all orders" on orders
  for select using (public.is_admin());
create policy "Admins can update orders" on orders
  for update using (public.is_admin());

-- Order items (via security definer)
create policy "Users can view own order items" on order_items
  for select using (public.owns_order(order_id));
create policy "Users can insert own order items" on order_items
  for insert with check (public.owns_order(order_id));

-- Questionnaires (via security definer)
create policy "Users can view own questionnaires" on questionnaires
  for select using (public.owns_order_item(order_item_id));
create policy "Users can update own questionnaires" on questionnaires
  for update using (public.owns_order_item(order_item_id));

-- Questionnaire answers (via security definer)
create policy "Users can view own answers" on questionnaire_answers
  for select using (public.owns_questionnaire(questionnaire_id));
create policy "Users can insert own answers" on questionnaire_answers
  for insert with check (public.owns_questionnaire(questionnaire_id));
create policy "Users can update own answers" on questionnaire_answers
  for update using (public.owns_questionnaire(questionnaire_id));

-- Generated documents (via security definer)
create policy "Users can view own generated docs" on generated_documents
  for select using (public.owns_order_item(order_item_id));

-- Invoices
create policy "Users can view own invoices" on invoices
  for select using (public.owns_order(order_id));

-- Activity log: admins only
create policy "Admins can view activity log" on activity_log
  for select using (public.is_admin());
create policy "System can insert activity log" on activity_log
  for insert with check (true);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_documents_category on documents(category);
create index idx_documents_slug on documents(slug);
create index idx_orders_profile on orders(profile_id);
create index idx_orders_status on orders(status);
create index idx_orders_mollie on orders(mollie_payment_id);
create index idx_order_items_order on order_items(order_id);
create index idx_questionnaires_order_item on questionnaires(order_item_id);
create index idx_doc_questions_document on document_questions(document_id, sort_order);
create index idx_qa_questionnaire on questionnaire_answers(questionnaire_id);
create index idx_generated_docs_order_item on generated_documents(order_item_id);
create index idx_invoices_order on invoices(order_id);
create index idx_activity_log_created on activity_log(created_at desc);

-- ============================================================
-- Seed Data: Virtually Yours Documents
-- ============================================================
insert into documents (title, slug, description, category, price_cents, includes, estimated_time_minutes, requires_review, sort_order) values
  ('Privacyverklaring AVG', 'privacyverklaring-avg', 'Voldoe aan de AVG als virtual assistant. Op maat gemaakt voor jouw dienstverlening.', 'privacy', 6900, array['Persoonsgegevens die worden verwerkt', 'Doelen van verwerking', 'Bewaartermijnen', 'Delen met derden', 'Rechten van betrokkenen', 'Beveiligingsmaatregelen', 'Cookiebeleid'], 10, false, 1),
  ('Verwerkersovereenkomst', 'verwerkersovereenkomst', 'Verplicht wanneer je als VA persoonsgegevens verwerkt namens je opdrachtgever.', 'privacy', 7900, array['Onderwerp en duur verwerking', 'Aard en doel verwerking', 'Type persoonsgegevens', 'Verplichtingen verwerker', 'Subverwerkers', 'Beveiligingsmaatregelen', 'Meldplicht datalekken'], 12, false, 2),
  ('Algemene Voorwaarden', 'algemene-voorwaarden', 'Op maat gemaakte AV voor virtual assistants en online dienstverleners.', 'commercieel', 12900, array['Definities en toepasselijkheid', 'Offertes en overeenkomsten', 'Uitvoering van de overeenkomst', 'Betalingsvoorwaarden', 'Aansprakelijkheid', 'Klachtenregeling', 'Toepasselijk recht'], 15, true, 3),
  ('Overeenkomst van Opdracht', 'overeenkomst-van-opdracht', 'Professionele overeenkomst tussen opdrachtgever en VA/ZZP''er.', 'arbeidsrecht', 8900, array['Gegevens opdrachtgever en opdrachtnemer', 'Omschrijving werkzaamheden', 'Honorarium en betalingsvoorwaarden', 'Intellectueel eigendom clausule', 'Geheimhoudingsclausule', 'Aansprakelijkheidsbeperking', 'Modelovereenkomst Belastingdienst conform'], 10, false, 4),
  ('NDA / Geheimhoudingsverklaring', 'nda-geheimhoudingsverklaring', 'Bescherm vertrouwelijke informatie bij samenwerkingen met opdrachtgevers.', 'commercieel', 4900, array['Definitie vertrouwelijke informatie', 'Verplichtingen partijen', 'Duur geheimhouding', 'Uitzonderingen', 'Boeteclausule', 'Toepasselijk recht'], 8, false, 5),
  ('Cookieverklaring', 'cookieverklaring', 'Transparant cookiebeleid voor de website van jouw VA-praktijk.', 'privacy', 3900, array['Wat zijn cookies', 'Welke cookies worden gebruikt', 'Functionele cookies', 'Analytische cookies', 'Marketing cookies', 'Cookie-instellingen beheren', 'Contact'], 8, false, 6),
  ('Freelance Samenwerkingsovereenkomst', 'freelance-samenwerkingsovereenkomst', 'Voor samenwerkingen tussen VA''s of met andere freelancers.', 'arbeidsrecht', 9900, array['Gegevens samenwerkende partijen', 'Doel samenwerking', 'Verdeling taken en verantwoordelijkheden', 'Financiele afspraken', 'Intellectueel eigendom', 'Duur en beeindiging', 'Geschillenregeling'], 12, true, 7);

-- Bundles
insert into bundles (title, slug, description, price_cents, discount_percentage) values
  ('VA Starterspakket', 'va-starterspakket', 'Alles wat je nodig hebt om te starten als juridisch VA. Inclusief Overeenkomst van Opdracht, Algemene Voorwaarden, Privacyverklaring en Verwerkersovereenkomst.', 31900, 20),
  ('Privacy Compleet', 'privacy-compleet', 'Volledig AVG-proof in een keer. Inclusief Privacyverklaring, Verwerkersovereenkomst en Cookieverklaring.', 15900, 15),
  ('Samenwerkingspakket', 'samenwerkingspakket', 'Voor VA''s die samenwerken. Inclusief Overeenkomst van Opdracht, NDA en Samenwerkingsovereenkomst.', 19900, 16);

-- Bundle items
insert into bundle_items (bundle_id, document_id)
select b.id, d.id from bundles b, documents d
where b.slug = 'va-starterspakket' and d.slug in ('overeenkomst-van-opdracht', 'algemene-voorwaarden', 'privacyverklaring-avg', 'verwerkersovereenkomst');

insert into bundle_items (bundle_id, document_id)
select b.id, d.id from bundles b, documents d
where b.slug = 'privacy-compleet' and d.slug in ('privacyverklaring-avg', 'verwerkersovereenkomst', 'cookieverklaring');

insert into bundle_items (bundle_id, document_id)
select b.id, d.id from bundles b, documents d
where b.slug = 'samenwerkingspakket' and d.slug in ('overeenkomst-van-opdracht', 'nda-geheimhoudingsverklaring', 'freelance-samenwerkingsovereenkomst');
