
--\c into forum

CREATE TABLE users (
    username VARCHAR(20) NOT NULL UNIQUE,
    email TEXT,
    password TEXT NOT NULL,
    user_id SERIAL PRIMARY KEY
);

CREATE TABLE categories (
    category_name VARCHAR(20),
    category_id SERIAL PRIMARY KEY
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title TEXT,
    body TEXT,
    category_id SERIAL,
    user_id SERIAL,
    FOREIGN KEY(user_id)
        REFERENCES users(user_id),
    FOREIGN KEY(category_id) 
        REFERENCES categories(category_id)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id SERIAL,
    user_id SERIAL,
    description TEXT,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id),
    FOREIGN KEY(post_id)
        REFERENCES posts(post_id)
);

