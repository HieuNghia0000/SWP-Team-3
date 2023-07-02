import moment from "moment";
import { celIdGenerator } from "./celIdGenerator";
import { DataTable, FetcherData } from "./types";

// TODO: add another transform function to transform data fetched from add new shift endpoint
// without losing the current data
export function transformData(data: FetcherData): DataTable {
  const transformedData: DataTable = {
    originShifts: {},
    shifts: {},
    cels: {},
    dates: data.dates,
    staffs: data.staffs,
    changedShifts: {},
    isChanged: false,
    isErrored: false,
    shiftsRules: {},
    preparingData: false,
  };

  if (data.staffs.length === 0) return transformedData;

  for (let staff of data.staffs) {
    for (let shift of staff.shifts) {
      transformedData.shifts[shift.shiftId] = { ...shift };
      transformedData.originShifts[shift.shiftId] = { ...shift };
      transformedData.changedShifts[shift.shiftId] = false;
    }

    for (let date of data.dates) {
      const celId = celIdGenerator(staff, date);
      const matchingShifts = staff.shifts.filter((s) =>
        moment(s.date).isSame(date, "day")
      );

      if (!transformedData.cels.hasOwnProperty(celId)) {
        transformedData.cels[celId] = [];
      }

      for (let shift of matchingShifts) {
        transformedData.cels[celId].push(shift.shiftId);
      }
    }
  }

  return transformedData;
}
