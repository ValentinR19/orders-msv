-- CREATE DATABASE IF NOT EXISTS ordersdb; SCRIPT PARA MYSQL

-- SCRIPT PARA POSTGRES
SELECT 'CREATE DATABASE ordersdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ordersdb')\gexec

CREATE SCHEMA ordersdb;

\c ordersdb

CREATE TABLE IF NOT EXISTS ordersdb.orders (
    id SERIAL PRIMARY KEY,
    total_amount DECIMAL(10,2) NOT NULL,
    total_items INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DELIVERED', 'CANCELLED')),
    paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ordersdb.orders_items (
    id SERIAL PRIMARY KEY,
    id_product INT NOT NULL,
    id_order INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
