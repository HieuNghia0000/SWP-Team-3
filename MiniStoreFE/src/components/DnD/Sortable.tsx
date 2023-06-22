import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, batch } from "solid-js";
import {
  shiftTimes,
  useSPData,
  useShiftPlanningModals,
} from "~/routes/shift-planning";
import { WorkSchedule, Role, Staff } from "~/types";

const Sortable: Component<{
  item: WorkSchedule;
  width: () => number | undefined;
  staff: Staff;
}> = ({ item, width, staff }) => {
  const { setShiftModalData, setShowShiftModal } = useShiftPlanningModals();
  const { fetchedData } = useSPData();
  const sortable = createSortable(item.scheduleId, {
    width: width,
    item,
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
          setShiftModalData({ ...item, staffId: staff.staffId, staff });
          setShowShiftModal(true);
        });
      }}
      class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-white hover:bg-[#edf2f7] border border-gray-200 select-none"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
          !item.published,
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
