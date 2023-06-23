import moment from "moment";
import { FetcherData, DataTable } from "~/routes/shift-planning";
import { celIdGenerator } from "./celIdGenerator";

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
    for (let shift of staff.workSchedule) {
      transformedData.shifts[shift.scheduleId] = { ...shift };
      transformedData.originShifts[shift.scheduleId] = { ...shift };
      transformedData.changedShifts[shift.scheduleId] = false;
    }

    for (let date of data.dates) {
      const celId = celIdGenerator(staff, date);
      const matchingShifts = staff.workSchedule.filter((s) =>
        moment(s.date).isSame(date, "day")
      );

      if (!transformedData.cels.hasOwnProperty(celId)) {
        transformedData.cels[celId] = [];
      }

      for (let shift of matchingShifts) {
        transformedData.cels[celId].push(shift.scheduleId);
      }
    }
  }

  return transformedData;
}
