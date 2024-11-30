-- -- Create the database
-- CREATE DATABASE IF NOT EXISTS parking_db;

-- -- Use the database
-- USE parking_db;

USE parking;

-- Create ParkingGarage table
CREATE TABLE IF NOT EXISTS ParkingGarage (
    garage_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    floors INT NOT NULL,
    num_rows INT NOT NULL,
    num_cols INT NOT NULL
);

-- Create ParkingSpot table
CREATE TABLE IF NOT EXISTS ParkingSpot (
    spot_id INT PRIMARY KEY AUTO_INCREMENT,
    garage_id INT,
    floor_number INT NOT NULL,
    spot_row INT NOT NULL,
    spot_col INT NOT NULL,
    lease_till DATETIME DEFAULT NULL,
    FOREIGN KEY (garage_id) REFERENCES ParkingGarage(garage_id)
);

--  User spots
CREATE TABLE IF NOT EXISTS Reservation (
    client_identifier VARCHAR(100),
    garage_id INT,
    spot_id INT
)