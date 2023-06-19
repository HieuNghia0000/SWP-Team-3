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

export interface DataResponse<T> extends Response {
  content: T;
  errors: string[] | string;
  timestamp: string;
  status: number;
}
