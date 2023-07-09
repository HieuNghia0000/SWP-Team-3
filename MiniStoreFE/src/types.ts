interface Timestamp {
    createdAt?: string;
    updatedAt?: string;
}

export enum Role {
    ALL_ROLES = "ALL_ROLES",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CASHIER = "CASHIER",
    GUARD = "GUARD",
}

export enum StaffStatus {
    ACTIVATED = "ACTIVATED",
    DISABLED = "DISABLED",
}

export enum TimesheetStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum ShiftCoverRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface Staff extends Timestamp {
    staffId: number;
    staffName: string;
    role: Role;
    username: string;
    password?: string;
    phoneNumber?: string;
    status: StaffStatus;
    image?: string;
    email?: string;
    workDays?: string;
    leaveBalance: number;

    // relationship
    salary?: Salary;
    shifts: Shift[];
}

export interface Salary {
    salaryId: number;
    staffId: number;
    hourlyWage: number;
    effectiveDate: string;
    terminationDate?: string;
}

export interface Shift extends Timestamp {
    shiftId: number;
    staffId: number;
    date: string;
    published: boolean;
    role: Role;
    salaryCoefficient: number;
    startTime: string;
    endTime: string;
    name: string;

    // relationship
    timesheet?: Timesheet;
    shiftCoverRequest?: ShiftCoverRequest;

    staff?: Staff;
}

export interface Timesheet {
    timesheetId: number;
    checkInTime: string;
    checkOutTime: string;
    status: TimesheetStatus;
    noteTitle?: string;
    noteContent?: string;
}

export interface ShiftCoverRequest extends Timestamp {
    shiftCoverRequestId: number;
    staffId: number;
    note: string;
    status: ShiftCoverRequestStatus;

    // relationship
    staff?: Staff;
}

export interface ShiftTemplate extends Timestamp {
    shiftTemplateId: number;
    startTime: string;
    endTime: string;
    name: string;
    salaryCoefficient: number;
    role: Role;
}

export interface ScheduleTemplate extends Timestamp {
    scheduleTemplateId: number;
    name: string;
    description: string;
    numOfShifts: number;

    // relationship
    shiftInfos?: ShiftMetaInfo[];
}

export interface ShiftScheduleTemplate {
    shiftTemplateId: number;
    scheduleTemplateId: number;
    date: string;
    staffName: string;
}

export interface ShiftMetaInfo extends ShiftTemplate, ShiftScheduleTemplate {
}

export interface Order extends Timestamp {
    orderId: number;
    orderDate: string;
    totalPrice: number;

    // relationship
    items: OrderItem[];
}

export interface OrderItem {
    orderItemId: number;
    orderId: number;
    quantity: number;
    productId: number;

    // relationship
    product: Product;
    order?: Order;
}

export interface Product {
    productId: number;
    barcode: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId?: number;

    // relationship
    category?: Category;
}

export interface Category {
    categoryId: number;
    name: string;
    description: string;

    // add on
    sales?: number;
    stock?: number;
}

export interface TimeClock {
    staffId: number;
    staffName: string;
    checkIn: string;
    checkOut: string;
    totalTime: string;
    role?: Role;
}

export interface DataResponse<T> extends Response {
    content: T;
    errors: string[] | string;
    timestamp: string;
    status: number;
}
