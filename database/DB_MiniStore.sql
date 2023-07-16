DROP DATABASE IF EXISTS MiniStore;
CREATE DATABASE IF NOT EXISTS MiniStore;
USE MiniStore;

-- Create Tables
CREATE TABLE Staffs (
    staff_id INT AUTO_INCREMENT NOT NULL,
    staff_name NVARCHAR(100) NOT NULL,
    role NVARCHAR(50),
    username NVARCHAR(100) NOT NULL,
    password NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(20),
    status INT,
    image NVARCHAR(200),
    email NVARCHAR(200),
    work_days NVARCHAR(200),
    leave_balance INT,
    PRIMARY KEY (staff_id)
);

CREATE TABLE Timesheets (
	timesheet_id INT AUTO_INCREMENT NOT NULL,
    shift_id INT NOT NULL,
    staff_id INT NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status INT,
    note_title NVARCHAR(100),
    note_content NVARCHAR(400),
    PRIMARY KEY (timesheet_id)
);

CREATE TABLE ShiftCoverRequests (
	shift_cover_request_id INT AUTO_INCREMENT NOT NULL,
    shift_id INT NOT NULL,
    staff_id INT,
    note NVARCHAR(400),
    status INT,
    PRIMARY KEY (shift_cover_request_id),
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE SET NULL
);

CREATE TABLE ShiftTemplates (
	shift_template_id INT AUTO_INCREMENT NOT NULL,
    start_time TIME,
    end_time TIME,
    name NVARCHAR(50),
    salary_coefficient FLOAT,
    role NVARCHAR(50),
    PRIMARY KEY (shift_template_id)
);

CREATE TABLE Shifts (
	shift_id INT AUTO_INCREMENT NOT NULL,
    staff_id INT NOT NULL,
    timesheet_id INT,
    shift_cover_request_id INT,
    date DATE,
    published TINYINT(1),
	start_time TIME,
    end_time TIME,
    name NVARCHAR(50),
    salary_coefficient FLOAT,
    role NVARCHAR(50),
	PRIMARY KEY (shift_id),
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE cascade,
    FOREIGN KEY (timesheet_id) REFERENCES Timesheets(timesheet_id) ON DELETE SET NULL,
    FOREIGN KEY (shift_cover_request_id) REFERENCES ShiftCoverRequests(shift_cover_request_id) ON DELETE SET NULL
);

alter table Timesheets add FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id) ON DELETE cascade;
alter table Timesheets add FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE cascade;
alter table ShiftCoverRequests add FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id) ON DELETE cascade;

CREATE TABLE ScheduleTemplates (
	schedule_template_id INT AUTO_INCREMENT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(400),
    num_of_shifts INT,
    PRIMARY KEY (schedule_template_id)
);

CREATE TABLE ScheduleShiftTemplates (
    schedule_shift_template_id INT AUTO_INCREMENT NOT NULL,
    schedule_template_id INT NOT NULL,
    staff_id INT NOT NULL,
    date DATE,
	start_time TIME,
    end_time TIME,
	salary_coefficient FLOAT,
    role NVARCHAR(50),
    PRIMARY KEY (schedule_shift_template_id),
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE cascade,
    FOREIGN KEY (schedule_template_id) REFERENCES ScheduleTemplates(schedule_template_id) ON DELETE cascade
);

CREATE TABLE LeaveRequests (
	leave_request_id INT AUTO_INCREMENT NOT NULL,
	staff_id INT NOT NULL,
    leave_type NVARCHAR(20),
	start_date DATE,
	end_date DATE,
	status INT,
	reason NVARCHAR(500),
    admin_reply NVARCHAR(500),
	PRIMARY KEY (leave_request_id),
	FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE cascade
);

CREATE TABLE Salaries (
	salary_id INT AUTO_INCREMENT NOT NULL,
    staff_id INT NOT NULL,
    hourly_wage NVARCHAR(10),
    effective_date DATE,
    termination_date DATE,
    PRIMARY KEY (salary_id),
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id) ON DELETE cascade
);

CREATE TABLE Holidays (
	holiday_id INT AUTO_INCREMENT NOT NULL,
	name NVARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
	coefficient FLOAT,
	PRIMARY KEY (holiday_id)
);

CREATE TABLE Categories (
	category_id INT AUTO_INCREMENT NOT NULL,
	name NVARCHAR(100),
    description NVARCHAR(300),
	PRIMARY KEY (category_id)
);

CREATE TABLE Products (
	product_id INT AUTO_INCREMENT NOT NULL,
	category_id INT,
	barcode NVARCHAR(20),
    name NVARCHAR(100) NOT NULL,
	description NVARCHAR(400),
	price FLOAT,
	inventory INT,
	PRIMARY KEY (product_id),
	FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

CREATE TABLE Orders (
	order_id INT AUTO_INCREMENT NOT NULL,
	order_date DATETIME NOT NULL,
	grand_total FLOAT,
	PRIMARY KEY (order_id)
);

CREATE TABLE OrderItems (
	order_item_id INT AUTO_INCREMENT NOT NULL,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT,
	PRIMARY KEY (order_item_id),
	FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE cascade,
	FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE cascade
);