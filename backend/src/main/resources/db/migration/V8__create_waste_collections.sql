CREATE TABLE waste_collections (
    id BIGSERIAL PRIMARY KEY,
    container_id BIGINT NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    collected_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collected_weight_kg DOUBLE PRECISION NOT NULL,
    collected_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_collections_container ON waste_collections(container_id);
CREATE INDEX idx_collections_user ON waste_collections(collected_by);
CREATE INDEX idx_collections_date ON waste_collections(collected_at);
