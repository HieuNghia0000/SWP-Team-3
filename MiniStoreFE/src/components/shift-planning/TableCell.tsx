import { createDroppable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Component, For, Show, createEffect, on } from "solid-js";
import { Staff, Shift } from "~/types";
import DraggableCard from "./DraggableCard";
import { useSPData, useShiftPlanningModals } from "~/context/ShiftPlanning";
import { findOverlappingShifts } from "./utils/findOverlappingShifts";

const TableCell: Component<{
  id: string;
  items: Shift[];
  staff: Staff;
  date: string;
}> = (props) => {
  const { setShowNewShiftModal, setNewShiftModalData } =
    useShiftPlanningModals();
  const { tableData } = useSPData();

  const droppable = createDroppable(props.id, {
    staff: props.staff,
    date: props.date,
  });
  const [state] = useDragDropContext() || [];
  0 && droppable;
  let divRef: HTMLDivElement | undefined = undefined;

  createEffect(
    on(
      () => props.items.length,
      () => {
        // console.log(props.id);
      }
    )
  );

  const onAddNewShift = () => {
    setShowNewShiftModal(true);
    setNewShiftModalData({
      staff: props.staff,
      date: props.date,
    });
  };

  function getShiftsByCellId(id: string) {
    if (!tableData.cells.hasOwnProperty(id)) {
      return []; // Key does not exist in transformed data
    }

    const shiftIds = tableData.cells[id];

    const shifts: Shift[] = [];
    for (let shiftId of shiftIds) {
      const shift = tableData.shifts[shiftId];
      if (shift) {
        shifts.push(shift);
      }
    }

    return shifts;
  }

  const overlappingShifts = () =>
    findOverlappingShifts([
      ...getShiftsByCellId(props.id),
      state?.active.draggable?.data.item,
    ]);

  const isErrored = () => {
    if (!droppable.isActiveDroppable) return false;

    const shift = state?.active.draggable?.data.item as Shift;

    // If the shift's required role is not the same role as the staff
    if (shift.shiftTemplate.role !== props.staff.role) return true;

    // If the shift overlaps with another shift
    if (overlappingShifts().includes(shift.shiftTemplateId)) return true;
  };

  return (
    <div
      // @ts-ignore
      use:droppable
      ref={divRef}
      class="flex flex-col border-r border-b border-gray-200 flex-1 overflow-hidden bg-[#f8fafc] pt-0.5 gap-y-0.5 relative"
    >
      <For each={props.items}>
        {(item) => (
          <DraggableCard
            item={item}
            width={() => divRef?.offsetWidth}
            staff={props.staff}
            date={props.date}
          />
        )}
      </For>
      <button
        onClick={onAddNewShift}
        class="flex flex-1 text-gray-400 min-h-[20px] items-center justify-center font-bold my-3 opacity-0 hover:opacity-100 cursor-pointer select-none"
        disabled={!!state?.active.draggable}
      >
        +
      </button>
      <Show when={isErrored()}>
        <div class="bg-red-400 bg-opacity-50 absolute inset-0"></div>
      </Show>
    </div>
  );
};

export default TableCell;
