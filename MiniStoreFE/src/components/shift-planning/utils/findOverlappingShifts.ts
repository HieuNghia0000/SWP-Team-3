import { sortBy, union, unionBy } from "lodash";
import moment from "moment";
import { Shift } from "~/types";

// Find overlapping shifts
// Returns an array of shiftTemplateIds of overlapping shifts
export function findOverlappingShifts(shifts: Shift[]) {
  const s = unionBy(shifts, "shiftId");
  const sortedShifts = sortBy(s, "shiftTemplate.startTime");
  const overlappingShifts: number[] = [];

  for (let i = 0; i < sortedShifts.length - 1; i++) {
    const currentShift = sortedShifts[i];
    const nextShift = sortedShifts[i + 1];

    const currentShiftStart = moment(
      currentShift.shiftTemplate.startTime,
      "h:mm:ss"
    );
    const currentShiftEnd = moment(
      currentShift.shiftTemplate.endTime,
      "h:mm:ss"
    );
    const nextShiftStart = moment(nextShift.shiftTemplate.startTime, "h:mm:ss");

    // console.log(
    //   currentShiftStart.format(),
    //   currentShiftEnd.format(),
    //   nextShiftStart.format()
    // );
    if (
      nextShiftStart.isBetween(
        currentShiftStart,
        currentShiftEnd,
        undefined,
        "[)"
      )
    ) {
      overlappingShifts.push(
        currentShift.shiftTemplateId,
        nextShift.shiftTemplateId
      );
    }
  }

  return union(overlappingShifts);
}
