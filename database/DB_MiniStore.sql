DROP DATABASE IF EXISTS MiniStore;
CREATE DATABASE IF NOT EXISTS MiniStore;
USE MiniStore;

-- Create Tables
CREATE TABLE Locations
(
	location_id NVARCHAR(100) NOT NULL,
	description NVARCHAR(100),
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
    leave_balance INT,
	PRIMARY KEY (staff_id)
);

CREATE TABLE Shifts
(
	shift_id INT AUTO_INCREMENT NOT NULL,
	start_time TIME,
	end_time TIME,
	shift_name NVARCHAR(50),
	day_of_week INT,
	salary_coefficient FLOAT,
    role NVARCHAR(50),
	PRIMARY KEY (shift_id)
);

CREATE TABLE WorkSchedules
(
	schedule_id INT AUTO_INCREMENT NOT NULL,
	staff_id INT,
	shift_id INT NOT NULL,
	date DATE NOT NULL,
	check_in_time TIME,
	check_out_time TIME,
	published TINYINT(1),
	PRIMARY KEY (schedule_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id),
	FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id)
);

CREATE TABLE Category
(
	category_id INT AUTO_INCREMENT NOT NULL,
	name NVARCHAR(100),
    description NVARCHAR(300),
	PRIMARY KEY (category_id)
);

CREATE TABLE Products
(
	product_id INT AUTO_INCREMENT NOT NULL,
	category_id INT,
	barcode NVARCHAR(20),
    name NVARCHAR(100),
	description NVARCHAR(400),
	price FLOAT,
	quantity INT,
	PRIMARY KEY (product_id),
	FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Vouchers
(
	voucher_code NVARCHAR(100) NOT NULL,
	discount_type NVARCHAR(10),
    discount_value FLOAT,
	max_discount FLOAT,
	valid_from DATETIME,
	valid_to DATETIME,
	used_count INT,
	PRIMARY KEY (voucher_code)
);

CREATE TABLE LeaveRequest
(
	leave_request_id INT AUTO_INCREMENT NOT NULL,
	staff_id INT NOT NULL,
    leave_type NVARCHAR(20),
	start_date DATE,
	end_date DATE,
	status INT,
	reason NVARCHAR(500),
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
	total_price INT,
    voucher_code NVARCHAR(100),
	PRIMARY KEY (order_id),
    FOREIGN KEY (voucher_code) REFERENCES Vouchers(voucher_code)
);

CREATE TABLE OrderItems
(
	order_item_id INT AUTO_INCREMENT NOT NULL,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT,
	PRIMARY KEY (order_item_id),
	FOREIGN KEY (order_id) REFERENCES Orders(order_id),
	FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
