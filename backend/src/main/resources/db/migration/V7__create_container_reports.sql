CREATE TABLE container_reports (
    id BIGSERIAL PRIMARY KEY,
    container_id BIGINT NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    reported_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);
CREATE INDEX idx_reports_container ON container_reports(container_id);
CREATE INDEX idx_reports_status ON container_reports(status);
CREATE INDEX idx_reports_user ON container_reports(reported_by);
