import { Staff } from "~/types";

export const celIdGenerator = (staff: Staff, date: string) =>
  `${staff.username}-${date}`;
