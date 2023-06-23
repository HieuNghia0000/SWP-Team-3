import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, batch, createEffect, on, onMount } from "solid-js";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { WorkSchedule, Role, Staff } from "~/types";
import { shiftTimes } from "./utils/shiftTimes";
import { findOverlappingShifts } from "./utils/findOverlappingShifts";
import { celIdGenerator } from "./utils/celIdGenerator";

const Sortable: Component<{
  item: WorkSchedule;
  items: WorkSchedule[];
  width: () => number | undefined;
  staff: Staff;
  date: string;
}> = ({ item, items, width, staff, date }) => {
  const { setShiftModalData, setShowShiftModal } = useShiftPlanningModals();
  const { fetchedData, tableData, setTableData } = useSPData();

  const isOrigin =
    tableData.originShifts[item.scheduleId].staffId === staff.staffId &&
    tableData.originShifts[item.scheduleId].date === date;

  const sortable = createSortable(item.scheduleId, {
    width: width,
    item: { ...item, date, staffId: staff.staffId },
    isOrigin,
  });

  function getShiftsByBoxId(droppableBoxId: string) {
    if (!tableData.cels.hasOwnProperty(droppableBoxId)) {
      return []; // Key does not exist in transformed data
    }

    const shiftIds = tableData.cels[droppableBoxId];

    const shifts: WorkSchedule[] = [];
    for (let shiftId of shiftIds) {
      const shift = tableData.shifts[shiftId];
      if (shift) {
        shifts.push(shift);
      }
    }

    return shifts;
  }

  const overlappingShifts = findOverlappingShifts(
    getShiftsByBoxId(celIdGenerator(staff, date))
  );

  const rules = [
    {
      name: "Match role",
      description:
        "Does this shift's required role matches with the staff's role?",
      passed: item.shift.role === staff.role,
    },
    {
      name: "Overlapping shifts",
      description: "Does this shift overlap with an existing shift?",
      passed: !overlappingShifts.includes(item.scheduleId),
    },
    {
      name: "Overlap leave request",
      description: "Does this shift overlap with a time off request?",
      passed: true,
    },
  ];

  createEffect(
    on(
      () => items.length,
      () => {
        console.log(item);
      }
    )
  );

  onMount(() => {
    batch(() => {
      if (!isOrigin) {
        setTableData("changedShifts", item.scheduleId, true);
      } else {
        setTableData("changedShifts", item.scheduleId, false);
      }
      // Modify shift data when drag and drop is done
      setTableData("shifts", item.scheduleId, () => ({
        staffId: staff.staffId,
        date: date,
        staff: staff,
      }));
      setTableData("shiftsRules", item.scheduleId, () => [...rules]);
    });
  });

  return (
    <button
      // @ts-ignore
      use:sortable
      type="button"
      // id={item.id.toString()}
      onClick={() => {
        if (sortable.isActiveDraggable) return;

        batch(() => {
          setShiftModalData({
            ...item,
            staffId: staff.staffId,
            staff,
            date,
            isOrigin,
            rules,
          });
          setShowShiftModal(true);
        });
      }}
      class="rounded mx-0.5 px-1.5 py-1 relative text-left select-none"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "bg-white hover:bg-[#edf2f7] text-black border border-gray-200":
          item.published && isOrigin,
        "bg-blue-100 hover:bg-blue-200 text-blue-500 border border-blue-100":
          item.published && !isOrigin,
        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
          !item.published && isOrigin,
        "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] hover:bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#bfeaff_5px,#bfeaff_10px)] border border-blue-100":
          !item.published && !isOrigin,
        "animate-pulse": fetchedData.loading,
      }}
    >
      <i
        class="absolute top-1 left-1 bottom-1 w-1.5 rounded"
        classList={{
          "bg-blue-500": item.shift.role === Role.CASHIER,
          "bg-yellow-500": item.shift.role === Role.GUARD,
          "bg-red-500": item.shift.role === Role.MANAGER,
          "bg-gray-500": item.shift.role === Role.ADMIN,
        }}
      ></i>
      <p class="ml-3 font-semibold text-sm">
        {shiftTimes(item.shift.startTime, item.shift.endTime)}
      </p>
      <p class="ml-3 font-normal text-xs text-gray-600">
        {item.shift.shiftName}
      </p>
    </button>
  );
};

export default Sortable;
