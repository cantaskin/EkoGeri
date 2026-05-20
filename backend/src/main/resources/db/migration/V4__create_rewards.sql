CREATE TABLE rewards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL,
    category VARCHAR(30) NOT NULL,
    stock INTEGER NOT NULL DEFAULT -1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
