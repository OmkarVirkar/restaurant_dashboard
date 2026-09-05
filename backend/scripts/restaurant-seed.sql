-- ==========================================
-- 1. SCHEMA DEFINITION & INDEXES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    page_url VARCHAR(255) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- ==========================================
-- 2. DUMMY DATA INSERTION
-- ==========================================

INSERT INTO users (name, email, role, created_at) VALUES
('Alice Smith', 'alice.smith@example.com', 'Customer', '2026-08-01 10:00:00'),
('Bob Johnson', 'bob.johnson@example.com', 'Customer', '2026-08-02 11:30:00'),
('Charlie Davis', 'charlie.davis@example.com', 'Customer', '2026-08-03 14:15:00'),
('Diana Prince', 'diana.prince@example.com', 'Premium', '2026-08-05 09:45:00'),
('Evan Wright', 'evan.wright@example.com', 'Customer', '2026-08-10 16:20:00'),
('Fiona Gallagher', 'fiona.gallagher@example.com', 'Premium', '2026-08-12 10:10:00'),
('George Miller', 'george.miller@example.com', 'Customer', '2026-08-15 13:05:00'),
('Hannah Abbott', 'hannah.abbott@example.com', 'Premium', '2026-08-18 15:50:00'),
('Ian Malcolm', 'ian.malcolm@example.com', 'Customer', '2026-08-20 08:30:00'),
('Julia Roberts', 'julia.roberts@example.com', 'Customer', '2026-08-25 17:40:00')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (name, price, category) VALUES
('Wireless Headphones', 149.99, 'Electronics'),
('Ergonomic Chair', 299.50, 'Furniture'),
('Mechanical Keyboard', 89.99, 'Electronics'),
('Stainless Steel Water Bottle', 24.00, 'Accessories'),
('Adjustable Standing Desk', 450.00, 'Furniture')
ON CONFLICT DO NOTHING;

INSERT INTO sales (user_id, product_id, quantity, total_amount, sale_date) VALUES
(1, 1, 1, 149.99, '2026-08-26 10:15:00'),
(2, 3, 2, 179.98, '2026-08-26 11:45:00'),
(4, 5, 1, 450.00, '2026-08-26 14:20:00'),
(3, 4, 3, 72.00, '2026-08-27 09:30:00'),
(5, 2, 1, 299.50, '2026-08-27 15:10:00'),
(6, 1, 2, 299.98, '2026-08-28 10:05:00'),
(8, 3, 1, 89.99, '2026-08-28 12:50:00'),
(9, 4, 1, 24.00, '2026-08-28 16:35:00'),
(7, 5, 1, 450.00, '2026-08-29 08:25:00'),
(10, 2, 2, 599.00, '2026-08-29 11:15:00'),
(1, 4, 2, 48.00, '2026-08-29 14:40:00'),
(2, 1, 1, 149.99, '2026-08-30 09:55:00'),
(3, 3, 1, 89.99, '2026-08-30 13:20:00'),
(4, 2, 1, 299.50, '2026-08-31 10:10:00'),
(5, 1, 1, 149.99, '2026-08-31 12:45:00'),
(6, 5, 1, 450.00, '2026-08-31 15:30:00'),
(7, 4, 4, 96.00, '2026-09-01 08:20:00'),
(8, 1, 1, 149.99, '2026-09-01 10:05:00'),
(9, 2, 1, 299.50, '2026-09-01 11:35:00'),
(10, 3, 2, 179.98, '2026-09-01 12:15:00');

INSERT INTO analytics (user_id, event_type, page_url, device_type, timestamp) VALUES
(1, 'page_view', '/home', 'desktop', '2026-08-26 10:00:00'),
(1, 'add_to_cart', '/product/1', 'desktop', '2026-08-26 10:10:00'),
(1, 'checkout', '/checkout', 'desktop', '2026-08-26 10:15:00'),
(2, 'page_view', '/home', 'mobile', '2026-08-26 11:30:00'),
(2, 'search', '/search?q=keyboard', 'mobile', '2026-08-26 11:35:00'),
(2, 'add_to_cart', '/product/3', 'mobile', '2026-08-26 11:40:00'),
(2, 'checkout', '/checkout', 'mobile', '2026-08-26 11:45:00'),
(4, 'page_view', '/products/furniture', 'desktop', '2026-08-26 14:05:00'),
(4, 'add_to_cart', '/product/5', 'desktop', '2026-08-26 14:15:00'),
(4, 'checkout', '/checkout', 'desktop', '2026-08-26 14:20:00'),
(3, 'page_view', '/home', 'tablet', '2026-08-27 09:15:00'),
(3, 'add_to_cart', '/product/4', 'tablet', '2026-08-27 09:25:00'),
(3, 'checkout', '/checkout', 'tablet', '2026-08-27 09:30:00'),
(5, 'search', '/search?q=chair', 'mobile', '2026-08-27 15:00:00'),
(5, 'page_view', '/product/2', 'mobile', '2026-08-27 15:05:00'),
(5, 'checkout', '/checkout', 'mobile', '2026-08-27 15:10:00'),
(6, 'page_view', '/home', 'desktop', '2026-08-28 09:50:00'),
(6, 'add_to_cart', '/product/1', 'desktop', '2026-08-28 10:00:00'),
(6, 'checkout', '/checkout', 'desktop', '2026-08-28 10:05:00'),
(8, 'page_view', '/products/electronics', 'desktop', '2026-08-28 12:35:00'),
(8, 'add_to_cart', '/product/3', 'desktop', '2026-08-28 12:45:00'),
(8, 'checkout', '/checkout', 'desktop', '2026-08-28 12:50:00'),
(9, 'page_view', '/home', 'mobile', '2026-08-28 16:25:00'),
(9, 'add_to_cart', '/product/4', 'mobile', '2026-08-28 16:30:00'),
(9, 'checkout', '/checkout', 'mobile', '2026-08-28 16:35:00'),
(7, 'search', '/search?q=desk', 'desktop', '2026-08-29 08:15:00'),
(7, 'add_to_cart', '/product/5', 'desktop', '2026-08-29 08:20:00'),
(7, 'checkout', '/checkout', 'desktop', '2026-08-29 08:25:00'),
(10, 'page_view', '/product/2', 'tablet', '2026-08-29 11:05:00'),
(10, 'checkout', '/checkout', 'tablet', '2026-08-29 11:15:00');
