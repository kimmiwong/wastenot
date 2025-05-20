CREATE TABLE IF NOT EXISTS food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    expiration_date DATE,
    category TEXT NOT NULL
);

INSERT INTO food_items (name, expiration_date, category)
VALUES ('milk', '2025-05-22', 'fridge'),
('pasta', '2025-06-01', 'pantry'),
('broccoli', '2025-05-25', 'fridge');
