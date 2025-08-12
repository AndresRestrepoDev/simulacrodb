CREATE DATABASE lovelace;

USE lovelace;

CREATE TABLE clients(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100),
	password VARCHAR(50),
	email VARCHAR(100),
	phone VARCHAR(50),
	address VARCHAR(100),
	genre VARCHAR(50)
);

INSERT INTO clients (name,email) VALUES ('antony', 'antony@correo.com');
INSERT INTO clients (name, password, email) VALUES ('andres', '12345', 'andres@correo.com');

UPDATE clients SET password = '1234';



SELECT * FROM clients;