import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, batch, createEffect } from "solid-js";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { WorkSchedule, Role, Staff } from "~/types";
import { shiftTimes } from "./utils/shiftTimes";

const Sortable: Component<{
  item: WorkSchedule;
  width: () => number | undefined;
  staff: Staff;
  date: string;
}> = ({ item, width, staff, date }) => {
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

  createEffect(() => {
    if (!isOrigin) {
      setTableData("changedShifts", item.scheduleId, true);
    } else {
      setTableData("changedShifts", item.scheduleId, false);
    }
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
          setShiftModalData({ ...item, staffId: staff.staffId, staff, date });
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
        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
          !item.published && isOrigin,
        "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] hover:bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#bfeaff_5px,#bfeaff_10px)]":
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
