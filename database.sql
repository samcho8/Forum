CREATE DATABASE posts;

--\c into posts

CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    body VARCHAR(255),
    category_id SERIAL,
    FOREIGN KEY(category_id) 
        REFERENCES categories(category_id),
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id SERIAL,
    description VARCHAR(255),
    FOREIGN KEY(post_id)
        REFERENCES post(post_id),
);

CREATE TABLE categories (
    category_name VARCHAR(20),
    category_id SERIAL PRIMARY KEY
);

CREATE TABLE users (
    username VARCHAR(20),
    email VARCHAR(25),
    password VARCHAR(20),
    user_id SERIAL PRIMARY KEY
);