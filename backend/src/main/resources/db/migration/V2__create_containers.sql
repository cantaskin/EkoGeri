CREATE TABLE containers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity_kg DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    current_fill_kg DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    waste_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_waste_type ON containers(waste_type);
