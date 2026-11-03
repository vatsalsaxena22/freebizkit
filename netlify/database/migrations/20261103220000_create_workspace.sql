CREATE TABLE fbk_profiles (
 user_id text PRIMARY KEY,
 data jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE fbk_documents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id text NOT NULL,
 kind text NOT NULL CHECK (kind IN ('invoice','quotation','receipt')),
 number text NOT NULL,
 customer_name text NOT NULL,
 currency text NOT NULL,
 total numeric(18,2) NOT NULL,
 data jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX fbk_documents_user_updated ON fbk_documents(user_id,updated_at DESC);
CREATE TABLE fbk_action_limits (
 user_id text PRIMARY KEY,
 window_start timestamptz NOT NULL DEFAULT now(),
 count integer NOT NULL DEFAULT 1
);
