import {
  createDroppable,
  useDragDropContext,
  SortableProvider,
} from "@thisbeyond/solid-dnd";
import { Component, For } from "solid-js";
import { useShiftPlanningModals } from "~/routes/shift-planning";
import { Staff, WorkSchedule } from "~/types";
import Sortable from "./Sortable";

const TableCel: Component<{
  id: string;
  items: WorkSchedule[];
  staff: Staff;
  date: string;
}> = (props) => {
  const { setShowNewShiftModal, setNewShiftModalData } =
    useShiftPlanningModals();

  const droppable = createDroppable(props.id);
  const [state] = useDragDropContext()!;
  0 && droppable;
  let divRef: HTMLDivElement | undefined = undefined;

  const onAddNewShift = () => {
    setShowNewShiftModal(true);
  };

  return (
    <div
      // @ts-ignore
      use:droppable
      ref={divRef}
      class="flex flex-col border-r border-b border-gray-200 flex-1 overflow-hidden bg-[#f8fafc] pt-0.5 gap-y-0.5"
    >
      <SortableProvider ids={props.items.map((item) => item.scheduleId)}>
        <For each={props.items}>
          {(item) => (
            <Sortable
              item={item}
              width={() => divRef?.offsetWidth}
              staff={props.staff}
            />
          )}
        </For>
      </SortableProvider>
      <button
        onClick={onAddNewShift}
        class="flex flex-1 text-gray-400 min-h-[20px] items-center justify-center font-bold my-3 opacity-0 hover:opacity-100 cursor-pointer select-none"
        disabled={!!state.active.draggable}
      >
        +
      </button>
    </div>
  );
};

export default TableCel;
