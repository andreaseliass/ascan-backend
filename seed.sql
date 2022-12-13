DROP DATABASE IF EXISTS dbbackend;
CREATE DATABASE dbbackend;
USE dbbackend;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TABLE status (
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE subscriptions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES status(id)
);
CREATE TABLE event_history (
    id INT NOT NULL AUTO_INCREMENT,
    subscription_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

INSERT INTO users (full_name) VALUES ('John Doe');
INSERT INTO status (status_name) VALUES ('SUBSCRIPTION_PURCHASED'), ('SUBSCRIPTION_CANCELED'), ('SUBSCRIPTION_RESTARTED');