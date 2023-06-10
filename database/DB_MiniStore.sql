DROP DATABASE IF EXISTS MiniStore;
CREATE DATABASE IF NOT EXISTS MiniStore;
USE MiniStore;

-- Create Tables
CREATE TABLE Locations
(
	location_id INT AUTO_INCREMENT NOT NULL,
	computer_id NVARCHAR(100),
	PRIMARY KEY (location_id)
);

CREATE TABLE Staffs
(
	staff_id INT AUTO_INCREMENT NOT NULL,
	staff_name NVARCHAR(100) NOT NULL,
	role NVARCHAR(50) NOT NULL,
	username NVARCHAR(100) NOT NULL,
	password NVARCHAR(100) NOT NULL,
	phone_number NVARCHAR(20),
	base_salary FLOAT,
	status INT,
	image NVARCHAR(200),
	email NVARCHAR(200),
	work_days NVARCHAR(200),
	PRIMARY KEY (staff_id)
);

CREATE TABLE Shifts
(
	shift_id INT AUTO_INCREMENT NOT NULL,
	start_time TIME,
	end_time TIME,
	slots INT,
	day_of_week INT,
	salary_coefficient FLOAT,
    role NVARCHAR(50),
	PRIMARY KEY (shift_id)
);

CREATE TABLE WorkSchedules
(
	schedule_id INT AUTO_INCREMENT NOT NULL,
	staff_id INT NOT NULL,
	shift_id INT NOT NULL,
	work_date DATE NOT NULL,
	check_in_time TIME,
	check_out_time TIME,
	status INT,
	PRIMARY KEY (schedule_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id),
	FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id)
);

CREATE TABLE Category
(
	category_id INT AUTO_INCREMENT NOT NULL,
	name NVARCHAR(100),
	PRIMARY KEY (category_id)
);

CREATE TABLE Products
(
	product_id INT AUTO_INCREMENT NOT NULL,
	category_id INT,
	barcode NVARCHAR(20),
	description NVARCHAR(400),
	price FLOAT,
	quantity INT,
	PRIMARY KEY (product_id),
	FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Vouchers
(
	voucher_id INT AUTO_INCREMENT NOT NULL,
	code NVARCHAR(200) NOT NULL,
	voucher_type INT,
	discount_type INT,
	max_discount FLOAT,
	valid_from DATETIME,
	valid_to DATETIME,
	used_count INT,
	PRIMARY KEY (voucher_id)
);

CREATE TABLE TimeOffRequest
(
	leave_request_id INT AUTO_INCREMENT NOT NULL,
	staff_id INT NOT NULL,
	start_date DATE,
	end_date DATE,
	status INT,
	comments NVARCHAR(500),
    admin_reply NVARCHAR(500),
	PRIMARY KEY (leave_request_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id)
);

CREATE TABLE HolidayCoef
(
	holiday_coef_id INT AUTO_INCREMENT NOT NULL,
	name NVARCHAR(100),
    start_date DATE,
    end_date DATE,
	coefficient FLOAT,
	PRIMARY KEY (holiday_coef_id)
);

CREATE TABLE Revenue
(
	revenue_id INT AUTO_INCREMENT NOT NULL,
	date DATE,
	amount FLOAT,
	PRIMARY KEY (revenue_id)
);

CREATE TABLE Orders
(
	order_id INT AUTO_INCREMENT NOT NULL,
	order_date DATETIME NOT NULL,
	total_amount INT,
	PRIMARY KEY (order_id)
);

CREATE TABLE OrderItems
(
	order_item_id INT AUTO_INCREMENT NOT NULL,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	voucher_id INT,
	price FLOAT,
	quantity INT,
	PRIMARY KEY (order_item_id),
	FOREIGN KEY (order_id) REFERENCES Orders(order_id),
	FOREIGN KEY (product_id) REFERENCES Products(product_id),
	FOREIGN KEY (voucher_id) REFERENCES Vouchers(voucher_id)
);
