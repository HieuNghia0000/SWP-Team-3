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
  username: string;
  staffName: string;
  email?: string;
  role: Role;
  status: Status;
  image?: string;
  phoneNumber?: string;
  baseSalary?: number;
  workDays?: string;
  createdAt?: string;
  updatedAt?: string;
}
