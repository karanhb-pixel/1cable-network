-- MySQL schema for wifi_plans data

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS cable_network;

USE cable_network;

-- Create wp_wifi_plans table
CREATE TABLE wp_wifi_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    speed INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    `6_month` VARCHAR(50) NOT NULL,
    `12_month` VARCHAR(50) NOT NULL
);

-- Insert sample data based on wifi_plans.json
INSERT INTO wp_wifi_plans (speed, color, `6_month`, `12_month`) VALUES
(50, 'red', '₹3100/-', '₹5400/-'),
(60, 'blue', '₹3300/-', '₹5700/-'),
(80, 'yellow', '₹3500/-', '₹6000/-'),
(100, 'green', '₹4000/-', '₹7000/-');

-- Create wp_ott_plans table
CREATE TABLE wp_ott_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    duration VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price VARCHAR(50) NOT NULL
);

-- Insert sample data based on ott_plans.json
INSERT INTO wp_ott_plans (duration, color, price) VALUES
('3 Months', 'blue', '900/-'),
('6 Months', 'green', '1800/-'),
('12 Months', 'yellow', '3600/-');