import { createDraggable } from "@thisbeyond/solid-dnd";
import { Component, batch, onMount } from "solid-js";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { Shift, Staff } from "~/types";
import { shiftTimes } from "./utils/shiftTimes";
import ShiftCard from "./ShiftCard";
import { getShiftRules } from "./utils/shiftRules";

const DraggableCard: Component<{
  shift: Shift;
  width: () => number | undefined;
  staff: Staff;
  date: string;
}> = ({ shift, width, staff, date }) => {
  const { setShiftModalData, setShowShiftModal } = useShiftPlanningModals();
  const { routeData, tableData, setTableData } = useSPData();

  const isOrigin =
    tableData.originShifts[shift.shiftId].staffId === staff.staffId &&
    tableData.originShifts[shift.shiftId].date === date &&
    tableData.originShifts[shift.shiftId].published ===
      tableData.shifts[shift.shiftId].published;

  const draggable = createDraggable(shift.shiftId, {
    width,
    item: { ...shift, date, staffId: staff.staffId },
    isOrigin,
  });

  const rules = getShiftRules(shift, { staff, date }, tableData);

  onMount(() => {
    batch(() => {
      if (!isOrigin) {
        setTableData("changedShifts", shift.shiftId, true);
      } else {
        setTableData("changedShifts", shift.shiftId, false);
      }
      // Modify shift data when drag and drop is done
      setTableData("shifts", shift.shiftId, () => ({
        staffId: staff.staffId,
        date: date,
        staff: staff,
      }));
      setTableData("shiftsRules", shift.shiftId, () => rules);
    });
  });

  return (
    <ShiftCard
      draggable={draggable}
      onClick={() => {
        if (draggable.isActiveDraggable) return;

        batch(() => {
          setShiftModalData({
            ...shift,
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
      published={shift.published}
      loading={routeData.loading}
      role={shift.shiftTemplate.role}
      shiftDuration={shiftTimes(
        shift.shiftTemplate.startTime,
        shift.shiftTemplate.endTime
      )}
      shiftName={shift.shiftTemplate.name}
      isErrored={rules.find((rule) => !rule.passed) !== undefined}
    />
  );
};

export default DraggableCard;
