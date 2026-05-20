CREATE TABLE redemptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id BIGINT NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
