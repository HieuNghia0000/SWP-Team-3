import { createDraggable } from "@thisbeyond/solid-dnd";
import { Component, batch, onMount } from "solid-js";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { Shift, Staff } from "~/types";
import { shiftTimes } from "./utils/shiftTimes";
import ShiftCard from "./ShiftCard";

const DraggableCard: Component<{
  item: Shift;
  width: () => number | undefined;
  staff: Staff;
  date: string;
}> = ({ item, width, staff, date }) => {
  const { setShiftModalData, setShowShiftModal } = useShiftPlanningModals();
  const { fetchedData, tableData, setTableData } = useSPData();

  const isOrigin =
    tableData.originShifts[item.shiftId].staffId === staff.staffId &&
    tableData.originShifts[item.shiftId].date === date;

  const draggable = createDraggable(item.shiftId, {
    width: width,
    item: { ...item, date, staffId: staff.staffId },
    isOrigin,
  });

  const rules = [
    {
      name: "Match role",
      description:
        "Does this shift's required role matches with the staff's role?",
      passed: item.shiftTemplate.role === staff.role,
    },
    {
      name: "Overlapping shifts",
      description: "Does this shift overlap with an existing shift?",
      passed: true,
    },
    {
      name: "Overlap leave request",
      description: "Does this shift overlap with a time off request?",
      passed: true,
    },
  ];

  onMount(() => {
    batch(() => {
      if (!isOrigin) {
        setTableData("changedShifts", item.shiftId, true);
      } else {
        setTableData("changedShifts", item.shiftId, false);
      }
      // Modify shift data when drag and drop is done
      setTableData("shifts", item.shiftId, () => ({
        staffId: staff.staffId,
        date: date,
        staff: staff,
      }));
      setTableData("shiftsRules", item.shiftId, () => [...rules]);
    });
  });

  return (
    <ShiftCard
      draggable={draggable}
      onClick={() => {
        if (draggable.isActiveDraggable) return;

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
      isActiveDraggable={draggable.isActiveDraggable}
      isOrigin={isOrigin}
      published={item.published}
      loading={fetchedData.loading}
      role={item.shiftTemplate.role}
      shiftDuration={shiftTimes(
        item.shiftTemplate.startTime,
        item.shiftTemplate.endTime
      )}
      shiftName={item.shiftTemplate.name}
    />
  );
};

export default DraggableCard;
