ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN payment_url TEXT,
ADD COLUMN support_contact VARCHAR(100);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (setting_key, setting_value) VALUES 
('telegram_contact', '@your_telegram'),
('whatsapp_contact', '+79001234567')
ON CONFLICT (setting_key) DO NOTHING;