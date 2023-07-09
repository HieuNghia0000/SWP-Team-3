import { Staff } from "~/types";

export const cellIdGenerator = (staff: Staff, date: string) =>
  `${staff.username}-${date}`;
