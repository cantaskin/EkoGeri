CREATE TABLE waste_deposits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    container_id BIGINT NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    waste_type VARCHAR(20) NOT NULL,
    estimated_weight_kg DOUBLE PRECISION NOT NULL,
    points_earned INTEGER NOT NULL,
    deposited_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deposits_user_id ON waste_deposits(user_id);
CREATE INDEX idx_deposits_container_id ON waste_deposits(container_id);
CREATE INDEX idx_deposits_deposited_at ON waste_deposits(deposited_at);
