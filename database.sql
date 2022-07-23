CREATE DATABASE posts;

--\c into posts

CREATE TABLE post (
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
        REFERENCES post(post_id)
);

CREATE TABLE categories (
    category_name VARCHAR(20),
    category_id SERIAL PRIMARY KEY
);

CREATE TABLE users (
    username VARCHAR(20) NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    user_id SERIAL PRIMARY KEY
);