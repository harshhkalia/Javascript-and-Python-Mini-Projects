-- CREATE DATABASE aboutindia;

-- USE aboutindia;

-- CREATE TABLE user_accounts(
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255),
--     email VARCHAR(200),
--     password_hashed VARCHAR(100)
-- );

-- CREATE TABLE user_reviews(
--     review_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     review_text VARCHAR(1000),
--     review_likes INT(255),
--     review_reports INT(255),
--     FOREIGN KEY (user_id) REFERENCES user_accounts(user_id)
-- );

-- ALTER TABLE user_reviews
-- ADD COLUMN added_on DATE ;

-- TRUNCATE TABLE user_reviews;