CREATE DATABASE posts;

--\c into posts

CREATE TABLE post ()
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    body VARCHAR(255)
);