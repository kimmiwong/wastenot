CREATE TABLE IF NOT EXISTS food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    expiration_date DATE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO food_items (name, expiration_date, category_id)
VALUES ('milk', '2025-05-22', '2'),
('pasta', '2025-06-01', '1'),
('broccoli', '2025-05-25', '2');


CREATE TABLE IF NOT EXISTS category
(category_id SERIAL PRIMARY KEY,
category_name VARCHAR (100)
);

INSERT INTO category (category_name)
VALUES ('pantry'),
('fridge');

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
