DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  product_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  dep_id INT(10)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (department_id),
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NULL
);
