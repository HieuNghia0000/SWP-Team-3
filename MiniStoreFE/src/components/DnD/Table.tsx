import {
  CollisionDetector,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  Draggable,
  Droppable,
  Id,
  SortableProvider,
  closestCenter,
  createDroppable,
  createSortable,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import moment from "moment";
import { Accessor, Component, For, Show, batch, createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { DataTable, useShiftPlanning } from "~/routes/shift-planning";
import { Role, WorkSchedule } from "~/types";
import createUniqueNumberId from "~/utils/createUniqueNumberId";

// a cel is a droppable box
// a shift is a draggable item

type DnDTableProps = {
  tableData: DataTable;
  setTableData: SetStoreFunction<DataTable>;
};

const Table: Component<DnDTableProps> = ({ tableData, setTableData }) => {
  const { setStaffModalData, setShowStaffModal } = useShiftPlanning();

  function getShiftsByBoxId(droppableBoxId: string) {
    if (!tableData.cels.hasOwnProperty(droppableBoxId)) {
      return []; // Key does not exist in transformed data
    }

    const shiftIds = tableData.cels[droppableBoxId];

    const shifts = [];
    for (let shiftId of shiftIds) {
      const shift = tableData.shifts.find(
        (shift) => shift.scheduleId === shiftId
      );
      if (shift) {
        shifts.push(shift);
      }
    }

    return shifts;
  }

  // Get all droppable box ids
  const droppableBoxIds = () => {
    return Object.keys(tableData.cels);
  };

  // Check if the id is a droppable box id
  const isDroppableBoxId = (id: string) => droppableBoxIds().includes(id);

  // Find the droppable box id of a draggable id
  const getDroppableBoxId = (draggableId: Id) => {
    for (let celId in tableData.cels) {
      const shiftIds = tableData.cels[celId];
      if (shiftIds.includes(draggableId as number)) {
        return celId;
      }
    }

    // If the draggable id is not found in any droppable box
    return "";
  };

  const closestContainerOrItem: CollisionDetector = (
    draggable,
    droppables,
    context
  ) => {
    const closestContainer = closestCenter(
      draggable,
      droppables.filter((droppable) =>
        isDroppableBoxId(droppable.id as string)
      ),
      context
    );
    if (closestContainer) {
      const containerItemIds = tableData.cels[closestContainer.id];
      const closestItem = closestCenter(
        draggable,
        droppables.filter((droppable) =>
          containerItemIds.includes(droppable.id as number)
        ),
        context
      );
      if (!closestItem) {
        return closestContainer;
      }

      if (getDroppableBoxId(draggable.id) !== closestContainer.id) {
        const isLastItem =
          containerItemIds.indexOf(closestItem.id as number) ===
          containerItemIds.length - 1;

        if (isLastItem) {
          const belowLastItem =
            draggable.transformed.center.y > closestItem.transformed.center.y;

          if (belowLastItem) {
            return closestContainer;
          }
        }
      }
      return closestItem;
    }
    return null;
  };

  const move = (
    draggable: Draggable,
    droppable: Droppable,
    onlyWhenChangingContainer = true
  ) => {
    // Get the droppable box id of the draggable
    const draggableContainerId = getDroppableBoxId(draggable.id);
    // Get the droppable box id of the droppable
    const droppableId = isDroppableBoxId(droppable.id as string)
      ? (droppable.id as string)
      : getDroppableBoxId(droppable.id);

    if (draggableContainerId != droppableId || !onlyWhenChangingContainer) {
      const containerItemIds = tableData.cels[droppableId];
      let index = containerItemIds.indexOf(droppable.id as number);
      if (index === -1) index = containerItemIds.length;

      batch(() => {
        setTableData("cels", draggableContainerId, (items) =>
          items.filter((item) => item !== draggable.id)
        );
        setTableData("cels", droppableId, (items) => [
          ...items.slice(0, index),
          draggable.id as number,
          ...items.slice(index),
        ]);
      });
    }
  };

  const onDragOver: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      move(draggable, droppable);
    }
  };

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      move(draggable, droppable, false);
    }
  };

  return (
    <div class="w-full">
      <div class="min-w-[1024px]">
        {/* Header */}
        <div class="sticky top-0 z-30 flex shadow-sm border border-gray-200 rounded-t-md">
          <div class="sticky left-0 z-30 px-3 py-2 flex flex-col justify-center border border-gray-200 w-48 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-white"></div>
          <For each={tableData.dates}>
            {(date) => (
              <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                <div class="font-semibold text-sm text-gray-600">
                  {moment(date).format("ddd, MMM D")}
                </div>
                <div class="font-normal text-sm text-gray-400">
                  19.5 hrs / $0
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Body - Drag container */}
        <div class="relative shadow-sm border border-gray-200 border-t-0">
          <Show when={tableData.staffs.length !== 0}>
            <DragDropProvider
              // onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              collisionDetector={closestContainerOrItem}
            >
              <DragDropSensors />
              {/* Row */}
              <For each={tableData.staffs}>
                {(staff) => (
                  <div class="flex">
                    <div class="sticky left-0 z-10 px-3 py-1.5 flex flex-col border border-t-0 border-gray-200 w-48 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-white">
                      <button
                        onClick={() => {
                          setStaffModalData(staff);
                          setShowStaffModal(true);
                        }}
                        class="font-semibold text-sm text-gray-600 text-start"
                      >
                        {staff.staffName}
                      </button>
                      <div class="font-normal text-sm text-gray-400">
                        0 hrs / $0
                      </div>
                    </div>
                    <For each={tableData.dates}>
                      {(date) => (
                        <TableCel
                          id={`${staff.username}-${date}`}
                          items={getShiftsByBoxId(`${staff.username}-${date}`)}
                        />
                      )}
                    </For>
                  </div>
                )}
              </For>

              <DragOverlay>
                {/* @ts-ignore */}
                {(draggable) => (
                  <button
                    type="button"
                    id={draggable?.id as string}
                    class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-[#edf2f7] border border-gray-200"
                    style={{ width: `${draggable?.data?.width() - 4}px` }}
                    classList={{
                      "hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
                        !(draggable?.data.shift as WorkSchedule).published,
                    }}
                  >
                    <i
                      class="absolute top-1 left-1 bottom-1 w-1.5 rounded"
                      classList={{
                        "bg-blue-700":
                          (draggable?.data.shift as WorkSchedule).shift.role ===
                          Role.CASHIER,
                        "bg-yellow-700":
                          (draggable?.data.shift as WorkSchedule).shift.role ===
                          Role.GUARD,
                        "bg-red-700":
                          (draggable?.data.shift as WorkSchedule).shift.role ===
                          Role.MANAGER,
                        "bg-gray-700":
                          (draggable?.data.shift as WorkSchedule).shift.role ===
                          Role.ADMIN,
                      }}
                    ></i>
                    <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
                    <p class="ml-3 font-normal text-xs text-gray-600">
                      {(draggable?.data.shift as WorkSchedule).shift.shiftName}
                    </p>
                  </button>
                )}
              </DragOverlay>
            </DragDropProvider>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Table;

const Sortable: Component<{
  item: WorkSchedule;
  width: () => number | undefined;
}> = ({ item, width }) => {
  const { setShiftModalData, setShowShiftModal } = useShiftPlanning();
  const sortable = createSortable(item.scheduleId, {
    width: width,
    shift: item,
  });

  return (
    <button
      // @ts-ignore
      use:sortable
      type="button"
      // id={item.id.toString()}
      onClick={() => {
        if (sortable.isActiveDraggable) return;
        setShiftModalData(item);
        setShowShiftModal(true);
      }}
      class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-white hover:bg-[#edf2f7] border border-gray-200 select-none"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
          !item.published,
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
      <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
      <p class="ml-3 font-normal text-xs text-gray-600">
        {item.shift.shiftName}
      </p>
    </button>
  );
};

const TableCel: Component<{
  id: string;
  items: WorkSchedule[];
}> = (props) => {
  const { setShowNewShiftModal, setNewShiftModalData } = useShiftPlanning();

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
          {(item) => <Sortable item={item} width={() => divRef?.offsetWidth} />}
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
