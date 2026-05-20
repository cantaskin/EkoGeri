ALTER TABLE containers ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255);
UPDATE containers SET qr_code = gen_random_uuid()::text WHERE qr_code IS NULL;
ALTER TABLE containers ALTER COLUMN qr_code SET NOT NULL;
ALTER TABLE containers ADD CONSTRAINT uk_containers_qr_code UNIQUE (qr_code);
CREATE INDEX IF NOT EXISTS idx_containers_qr_code ON containers(qr_code);
