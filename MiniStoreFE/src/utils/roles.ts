import { Role } from "~/types";

export const roles = [
  { value: "All roles", label: "All roles" },
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.MANAGER, label: "Manager" },
  { value: Role.CASHIER, label: "Cashier" },
  { value: Role.GUARD, label: "Guard" },
];
