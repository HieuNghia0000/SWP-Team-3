export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  GUARD = "GUARD",
}
export enum Status {
  ACTIVATED,
  DISABLED,
}

export interface Staff {
  staffId: number;
  staffName: string;
  role: Role;
  username: string;
  phoneNumber?: string;
  baseSalary?: number;
  status: Status;
  image?: string;
  email?: string;
  workDays?: string;
  leaveBlance?: number;
  createdAt?: string;
  updatedAt?: string;

  // relationship
  workSchedule: WorkSchedule[];
}

export interface WorkSchedule {
  scheduleId: number;
  staffId: number;
  shiftID: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;

  // relationship
  shift: Shift;
  staff?: Staff;
}

export interface Shift {
  shiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  salaryCoefficient: number;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export type Order = {
  orderId: number;
  orderDate: string;
  totalPrice: number;
  voucherCode?: string;
  created_at?: string;
  updated_at?: string;

  // relationship
  items: OrderItem[];
  voucher?: Voucher;
};

export type OrderItem = {
  orderItemId: number;
  orderId: number;
  quantity: number;
  productId: number;

  // relationship
  product: Product;
  order?: Order;
};

export type Product = {
  productId: number;
  barcode: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId?: number;

  // relationship
  category?: Category;
};

export type Category = {
  categoryId: number;
  name: string;
  description: string;
};

export type Voucher = {
  voucherCode: string;
  discountValue: number;
  discountType: "PERCENTAGE" | "AMOUNT";
  maxDiscount: number;
  validFrom: string;
  validTo: string;
  usedCount: number;
};

export interface DataResponse<T> extends Response {
  content: T;
  errors: string[] | string;
  timestamp: string;
  status: number;
}
