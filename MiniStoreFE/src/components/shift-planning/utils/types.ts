import { Staff, Shift } from "~/types";

export type ParamType = {
  picked_date: string;
};
export interface FetcherData {
  dates: string[];
  staffs: Staff[];
}

export type Rules = {
  name: string;
  description: string;
  passed: boolean;
};
export interface DataTable extends FetcherData {
  originShifts: { [key: Shift["shiftId"]]: Shift };
  shifts: { [key: Shift["shiftId"]]: Shift };
  cels: { [key: string]: Shift["shiftId"][] };
  isErrored: boolean;
  preparingData: boolean;
  isChanged: boolean;
  changedShifts: { [key: Shift["shiftId"]]: boolean };
  shiftsRules: { [key: Shift["shiftId"]]: Rules[] };
}
