CREATE TABLE IF NOT EXISTS category
(category_id SERIAL PRIMARY KEY,
category_name VARCHAR (100) UNIQUE
);

INSERT INTO category (category_name)
VALUES ('pantry'),
('fridge')
ON CONFLICT (category_name) DO NOTHING;


CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    session_token TEXT UNIQUE,
    session_expires_at TIMESTAMP,
    security_question TEXT,
    security_answer_hash TEXT
);


CREATE TABLE IF NOT EXISTS household (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    invite_id VARCHAR UNIQUE NOT NULL,
    admin_user_id INT NOT NULL,
    FOREIGN KEY (admin_user_id) REFERENCES account(id)

);

CREATE TABLE IF NOT EXISTS user_household (
    id SERIAL PRIMARY KEY,
    pending BOOLEAN DEFAULT TRUE,
    user_id INT UNIQUE NOT NULL,
    household_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES household(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expiration_date DATE NOT NULL,
    added_by_id INT NOT NULL,
    category_id INT NOT NULL,
    household_id INT NOT NULL,
    FOREIGN KEY (added_by_id) REFERENCES account(id),
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (household_id) REFERENCES household(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    food_id INT NOT NULL UNIQUE,
    FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorite_recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT,
    user_id INT NOT NULL,
    recipe_id TEXT NOT NULL, --made this text in case we change our API and this ends up not just being an integer
    source_url TEXT,
    FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE
);
