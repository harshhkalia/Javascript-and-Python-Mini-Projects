-- CREATE DATABASE Travel_Planner;

-- USE Travel_Planner;

-- CREATE TABLE user_account(
--     UserID INT NOT NULL AUTO_INCREMENT,
--     UserName VARCHAR(255) NOT NULL,
--     Email VARCHAR(255),
--     PasswordHash VARCHAR(255) NOT NULL,
--     PasswordSalt VARCHAR(255) NOT NULL,
--     PRIMARY KEY (UserID)
-- );

-- TRUNCATE TABLE user_notes;

-- CREATE TABLE user_review(
--     ReviewID INT NOT NULL AUTO_INCREMENT,
--     UserID INT NOT NULL,
--     Location VARCHAR(255),
--     ReviewText TEXT,
--     Rating INT,
--     PRIMARY KEY(ReviewID),
--     FOREIGN KEY(UserID) REFERENCES user_account(UserID)
-- )

-- DROP TABLE user_review;

-- CREATE TABLE user_notes(
--     NoteID INT NOT NULL AUTO_INCREMENT,
--     UserID INT NOT NULL,
--     Tittle VARCHAR(255) NOT NULL,
--     Date DATE,
--     NoteText TEXT NOT NULL,
--     TimeAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (NoteID),
--     FOREIGN KEY (UserID) REFERENCES user_account(UserID)
-- )