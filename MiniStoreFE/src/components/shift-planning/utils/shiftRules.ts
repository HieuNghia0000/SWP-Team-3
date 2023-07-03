import { Draggable, Droppable } from "@thisbeyond/solid-dnd";
import { findOverlappingShifts } from "./findOverlappingShifts";
import { DataTable, Rule } from "./types";
import getShiftsByCellId from "./getShiftsByCellId";
import { Role, Shift, Staff } from "~/types";
import { cellIdGenerator } from "./cellIdGenerator";
import isDayInThePast from "./isDayInThePast";

const rules: Rule[] = [
  {
    errorName: "Staff's role does not match",
    description:
      "Does this shift's required role matches with the staff's role?",
    passed: false,
  },
  {
    errorName: "Overlapping shifts",
    description: "Does this shift overlap with an existing shift?",
    passed: false,
  },
  // {
  //   errorName: "Overlap leave requests",
  //   description: "Does this shift overlap with a time off request?",
  //   passed: false,
  // },
];

export const getShiftRules = (
  shift: Shift,
  currentCell: {
    staff: Staff;
    date: string;
  },
  tableData: DataTable
) => {
  const result = rules.map((rule) => ({ ...rule }));

  // If the shift's required role is the same role as the staff
  if (
    shift.shiftTemplate.role === Role.ALL_ROLES ||
    shift.shiftTemplate.role === currentCell.staff.role
  )
    result[0].passed = true;

  // If the shift does not overlaps with another shift
  if (
    !findOverlappingShifts([
      ...getShiftsByCellId(
        cellIdGenerator(currentCell.staff, currentCell.date),
        tableData
      ),
      shift,
    ]).includes(shift.shiftTemplateId)
  )
    result[1].passed = true;

  return result;
};

export const getShiftMoveErrors = (
  draggable: Draggable,
  droppable: Droppable,
  tableData: DataTable
) => {
  const errors: Rule[] = [];

  // User can not modify a shift in the past
  if (isDayInThePast((draggable.data.item as Shift).date)) {
    errors.push({
      errorName: "Can not modify a shift in the past",
      description: "",
      passed: false,
    });
    return errors;
  }

  // User can not move a shift to the past
  if (isDayInThePast(droppable.data.date)) {
    errors.push({
      errorName: "Can not move a shift to the past",
      description: "",
      passed: false,
    });
    return errors;
  }

  // If the shift's required role is not the same role as the staff
  if (
    draggable.data.item.shiftTemplate.role !== Role.ALL_ROLES &&
    draggable.data.item.shiftTemplate.role !== droppable.data.staff.role
  )
    errors.push(rules[0]);

  // If the shift overlaps with another shift
  if (
    findOverlappingShifts([
      ...getShiftsByCellId(droppable.id as string, tableData),
      draggable.data.item,
    ]).includes(draggable.data.item.shiftTemplateId)
  )
    errors.push(rules[1]);

  return errors;
};
