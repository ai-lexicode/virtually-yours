-- Newsletter drip campaign tables (feat-017)

-- Trigger type enum
CREATE TYPE drip_trigger_type AS ENUM ('welcome', 're_engagement');

-- Sequences
CREATE TABLE newsletter_drip_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type drip_trigger_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Steps within a sequence
CREATE TABLE newsletter_drip_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES newsletter_drip_sequences(id) ON DELETE CASCADE,
  delay_days INTEGER NOT NULL DEFAULT 0,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  step_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual send records
CREATE TABLE newsletter_drip_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES newsletter_drip_steps(id) ON DELETE CASCADE,
  subscriber_email TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_drip_steps_sequence ON newsletter_drip_steps(sequence_id);
CREATE INDEX idx_drip_sends_step ON newsletter_drip_sends(step_id);
CREATE INDEX idx_drip_sends_email ON newsletter_drip_sends(subscriber_email);
CREATE INDEX idx_drip_sends_status ON newsletter_drip_sends(status);

-- RLS
ALTER TABLE newsletter_drip_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_drip_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_drip_sends ENABLE ROW LEVEL SECURITY;

-- Admin full access (service role bypasses RLS, but define policies for completeness)
CREATE POLICY "Admin full access on drip_sequences"
  ON newsletter_drip_sequences FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on drip_steps"
  ON newsletter_drip_steps FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on drip_sends"
  ON newsletter_drip_sends FOR ALL
  USING (true) WITH CHECK (true);
