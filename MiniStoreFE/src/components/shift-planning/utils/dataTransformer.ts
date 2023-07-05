import moment from "moment";
import { cellIdGenerator } from "./cellIdGenerator";
import { DataTable, FetcherData } from "./types";

// TODO: add another transform function to transform data fetched from add new shift endpoint
// without losing the current data
export function transformData(
  data: FetcherData,
  simple: boolean = false
): DataTable {
  const transformedData: DataTable = {
    originShifts: {},
    shifts: {},
    cells: {},
    dates: data.dates,
    staffs: data.staffs,
    changedShifts: {},
    isChanged: false,
    shiftsRules: {},
    preparingData: false,
  };

  if (data.staffs.length === 0) return transformedData;

  for (let staff of data.staffs) {
    for (let shift of staff.shifts) {
      transformedData.shifts[shift.shiftId] = { ...shift };
      if (simple) continue;
      transformedData.originShifts[shift.shiftId] = { ...shift };
      transformedData.changedShifts[shift.shiftId] = false;
    }

    for (let date of data.dates) {
      const cellId = cellIdGenerator(staff, date);
      const matchingShifts = staff.shifts.filter((s) =>
        moment(s.date).isSame(date, "day")
      );

      if (!transformedData.cells.hasOwnProperty(cellId)) {
        transformedData.cells[cellId] = [];
      }

      for (let shift of matchingShifts) {
        transformedData.cells[cellId].push(shift.shiftId);
      }
    }
  }

  return transformedData;
}
