import { Staff, Shift } from "~/types";

export type ParamType = {
  picked_date: string;
};
export interface FetcherData {
  dates: string[];
  staffs: Staff[];
}

export type Rule = {
  errorName: string;
  description: string;
  passed: boolean;
};
export interface DataTable extends FetcherData {
  originShifts: { [key: Shift["shiftId"]]: Shift };
  shifts: { [key: Shift["shiftId"]]: Shift };
  cells: { [key: string]: Shift["shiftId"][] };
  isChanged: boolean;
  changedShifts: { [key: Shift["shiftId"]]: boolean };
  shiftsRules: { [key: Shift["shiftId"]]: Rule[] };
}
