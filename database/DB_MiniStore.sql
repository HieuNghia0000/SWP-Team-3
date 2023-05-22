USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name='MiniStore')
BEGIN
	-- Close existing connection before drop
	ALTER DATABASE MiniStore SET single_user WITH rollback immediate
	-- Drop existing database 
	DROP DATABASE MiniStore
END
GO
CREATE DATABASE MiniStore
GO
USE MiniStore
GO

-- Create Tables
CREATE TABLE CheckInLocations
(
	location_id INT IDENTITY(1,1) NOT NULL,
	name NVARCHAR(200) NOT NULL,
	value NVARCHAR(200),
	location_type INT,
	PRIMARY KEY (location_id),
);

CREATE TABLE Staffs
(
	staff_id INT IDENTITY(1,1) NOT NULL,
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
	PRIMARY KEY (staff_id),
);

CREATE TABLE Shifts
(
	shift_id INT IDENTITY(1,1) NOT NULL,
	start_time TIME,
	end_time TIME,
	sheet_number INT,
	day_of_week INT,
	salary_coefficient FLOAT,
	PRIMARY KEY (shift_id)
);

CREATE TABLE WorkSchedules
(
	schedule_id INT IDENTITY(1,1) NOT NULL,
	staff_id INT NOT NULL,
	shift_id INT NOT NULL,
	location_id INT NOT NULL,
	work_date DATE NOT NULL,
	check_in_time TIME,
	check_out_time TIME,
	status INT,
	PRIMARY KEY (schedule_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id),
	FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id),
	FOREIGN KEY (location_id) REFERENCES CheckInLocations(location_id)
);

CREATE TABLE Products
(
	product_id INT IDENTITY(1,1) NOT NULL,
	name NVARCHAR(200) NOT NULL,
	description NVARCHAR(400),
	price FLOAT,
	quantity INT,
	PRIMARY KEY (product_id)
);

CREATE TABLE Vouchers
(
	voucher_id INT IDENTITY(1,1) NOT NULL,
	code NVARCHAR(200) NOT NULL,
	voucher_type INT,
	discount_type INT,
	max_discount FLOAT,
	valid_from DATETIME,
	valid_to DATETIME,
	used_count INT,
	PRIMARY KEY (voucher_id)
);

CREATE TABLE LeaveRequests
(
	leave_request_id INT IDENTITY(1,1) NOT NULL,
	staff_id INT NOT NULL,
	start_date DATE,
	end_date DATE,
	status INT,
	comments NVARCHAR(500),
	PRIMARY KEY (leave_request_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id)
);

CREATE TABLE HolidayCoef
(
	holiday_coef_id INT IDENTITY(1,1) NOT NULL,
	holiday_date DATE,
	coefficient FLOAT,
	PRIMARY KEY (holiday_coef_id)
);

CREATE TABLE Revenue
(
	revenue_id INT IDENTITY(1,1) NOT NULL,
	date DATE,
	amount FLOAT,
	PRIMARY KEY (revenue_id)
);

CREATE TABLE Orders
(
	order_id INT IDENTITY(1,1) NOT NULL,
	customer_name NVARCHAR(100),
	order_date DATE NOT NULL,
	total_amount INT,
	PRIMARY KEY (order_id)
);

CREATE TABLE OrderItems
(
	order_item_id INT IDENTITY(1,1) NOT NULL,
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