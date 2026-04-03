-- Newsletter schema for Virtually Yours
-- Migration: 20260404000001_newsletter_schema.sql

-- ============================================================
-- Enums
-- ============================================================
CREATE TYPE newsletter_status AS ENUM ('draft', 'sending', 'sent');
CREATE TYPE newsletter_list_type AS ENUM ('general', 'list');
CREATE TYPE newsletter_recipient_status AS ENUM ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained');

-- ============================================================
-- Tables
-- ============================================================

-- Newsletter subscriptions for registered users
CREATE TABLE newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  general boolean NOT NULL DEFAULT true,
  bounce_count integer NOT NULL DEFAULT 0,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter leads (non-registered visitors)
CREATE TABLE newsletter_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  source text NOT NULL DEFAULT 'footer',
  is_active boolean NOT NULL DEFAULT false,
  bounce_count integer NOT NULL DEFAULT 0,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  locale text DEFAULT 'nl',
  confirmed_at timestamptz,
  confirm_token text UNIQUE,
  confirm_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter lists (manual groupings)
CREATE TABLE newsletter_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter list members (users or leads)
CREATE TABLE newsletter_list_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES newsletter_lists(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES newsletter_leads(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT at_least_one_member CHECK (user_id IS NOT NULL OR lead_id IS NOT NULL),
  UNIQUE (list_id, user_id),
  UNIQUE (list_id, lead_id)
);

-- Newsletters (drafts and sent)
CREATE TABLE newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  status newsletter_status NOT NULL DEFAULT 'draft',
  list_type newsletter_list_type NOT NULL DEFAULT 'general',
  list_id uuid REFERENCES newsletter_lists(id) ON DELETE SET NULL,
  sent_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter recipients (per-email tracking)
CREATE TABLE newsletter_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id uuid NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  email text NOT NULL,
  user_id uuid,
  resend_message_id text UNIQUE,
  status newsletter_recipient_status NOT NULL DEFAULT 'queued',
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter clicks (per-link tracking)
CREATE TABLE newsletter_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES newsletter_recipients(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_newsletter_subs_user ON newsletter_subscriptions(user_id);
CREATE INDEX idx_newsletter_subs_active ON newsletter_subscriptions(is_active) WHERE is_active = true;
CREATE INDEX idx_newsletter_leads_email ON newsletter_leads(email);
CREATE INDEX idx_newsletter_leads_active ON newsletter_leads(is_active) WHERE is_active = true;
CREATE INDEX idx_newsletter_list_members_list ON newsletter_list_members(list_id);
CREATE INDEX idx_newsletters_status ON newsletters(status);
CREATE INDEX idx_newsletters_sent_at ON newsletters(sent_at DESC);
CREATE INDEX idx_newsletter_recipients_newsletter ON newsletter_recipients(newsletter_id);
CREATE INDEX idx_newsletter_recipients_resend ON newsletter_recipients(resend_message_id);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_clicks ENABLE ROW LEVEL SECURITY;

-- newsletter_subscriptions: users can manage their own, admins can do everything
CREATE POLICY "Users can view own subscription" ON newsletter_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON newsletter_subscriptions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins full access subscriptions" ON newsletter_subscriptions
  FOR ALL USING (public.is_admin());

-- newsletter_leads: admin only
CREATE POLICY "Admins full access leads" ON newsletter_leads
  FOR ALL USING (public.is_admin());

-- newsletter_lists: admin only
CREATE POLICY "Admins full access lists" ON newsletter_lists
  FOR ALL USING (public.is_admin());

-- newsletter_list_members: admin only
CREATE POLICY "Admins full access list members" ON newsletter_list_members
  FOR ALL USING (public.is_admin());

-- newsletters: admin only
CREATE POLICY "Admins full access newsletters" ON newsletters
  FOR ALL USING (public.is_admin());

-- newsletter_recipients: admin only (service role used for tracking)
CREATE POLICY "Admins full access recipients" ON newsletter_recipients
  FOR ALL USING (public.is_admin());

-- newsletter_clicks: admin only
CREATE POLICY "Admins full access clicks" ON newsletter_clicks
  FOR ALL USING (public.is_admin());
