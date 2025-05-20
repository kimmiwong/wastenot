CREATE TABLE food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    expiration_date DATE,
    category TEXT NOT NULL
);
