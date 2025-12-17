CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(12) NOT NULL,
    uc_amount INTEGER NOT NULL,
    bonus_uc INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_player_id ON orders(player_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);