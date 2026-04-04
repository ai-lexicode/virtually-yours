-- Web Vitals metrics storage (chore-007)

CREATE TABLE web_vitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,        -- LCP, INP, CLS, FCP, TTFB
  value NUMERIC NOT NULL,
  rating TEXT,                      -- good, needs-improvement, poor
  page_url TEXT NOT NULL,
  device_type TEXT,                 -- mobile, tablet, desktop
  connection_speed TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_web_vitals_metric ON web_vitals(metric_name, created_at);
CREATE INDEX idx_web_vitals_page ON web_vitals(page_url, created_at);

-- Web Vitals alerting thresholds (for feat-018)

CREATE TABLE web_vital_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  page_url TEXT,
  threshold_value NUMERIC NOT NULL,
  current_p75 NUMERIC NOT NULL,
  severity TEXT DEFAULT 'warning',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
