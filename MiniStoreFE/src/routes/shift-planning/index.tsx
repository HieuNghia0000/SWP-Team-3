import Breadcrumbs from "~/components/Breadcrumbs";
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
} from "@thisbeyond/solid-dnd";
import { createStore } from "solid-js/store";
import { Component, For, batch } from "solid-js";

const Sortable: Component<{ item: WorkSchedule }> = (props) => {
  const sortable = createSortable(props.item.id);

  return (
    <button
      // @ts-ignore
      use:sortable
      type="button"
      id={props.item.toString()}
      class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-blue-100 hover:bg-blue-200"
      classList={{ "opacity-25": sortable.isActiveDraggable }}
    >
      <i class="bg-blue-700 absolute top-1 left-1 bottom-1 w-1.5 rounded"></i>
      <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
      <p class="ml-3 font-normal text-xs text-gray-600">
        Cashier {props.item.id}
      </p>
    </button>
  );
};

const Column: Component<{ id: string; items: WorkSchedule[] }> = (props) => {
  const droppable = createDroppable(props.id);
  0 && droppable;

  return (
    <div
      // @ts-ignore
      use:droppable
      class="flex flex-col border-r border-b border-gray-200 flex-1 overflow-hidden bg-white pt-0.5"
    >
      <SortableProvider ids={props.items.map((item) => item.id)}>
        <For each={props.items}>{(item) => <Sortable item={item} />}</For>
      </SortableProvider>
    </div>
  );
};

function transformData(data: ShiftPlanningData) {
  const transformedData: {
    shifts: WorkSchedule[];
    cels: { [key: string]: number[] };
  } = { shifts: [], cels: {} };

  const staffKeys = Object.keys(data.staffs);

  for (let staffKey of staffKeys) {
    const staffShifts = data.staffs[staffKey];

    for (let shift of staffShifts) {
      transformedData.shifts.push(shift);
    }

    for (let date of data.dates) {
      const droppableId = `${staffKey}-${date}`;
      const matchingShifts = staffShifts.filter((shift) => shift.date === date);

      if (!transformedData.cels.hasOwnProperty(droppableId)) {
        transformedData.cels[droppableId] = [];
      }

      for (let shift of matchingShifts) {
        transformedData.cels[droppableId].push(shift.id);
      }
    }
  }

  return transformedData;
}

type WorkSchedule = {
  id: number; //unique id
  date: string;
};
interface ShiftPlanningData {
  dates: string[];
  staffs: Record<string, WorkSchedule[]>;
}

export default function ShiftPlanning() {
  const [data, setData] = createStore<ShiftPlanningData>({
    dates: ["1", "2", "3", "4", "5", "6", "7"],
    staffs: {
      "Open Shifts": [
        { id: 10, date: "1" },
        { id: 11, date: "2" },
        { id: 12, date: "1" },
      ],
      Hieu: [
        { id: 1, date: "2" },
        { id: 2, date: "1" },
        { id: 3, date: "1" },
      ],
      Khoa: [
        { id: 4, date: "5" },
        { id: 5, date: "4" },
        { id: 6, date: "5" },
      ],
      Nghia: [
        { id: 7, date: "3" },
        { id: 8, date: "4" },
        { id: 9, date: "1" },
      ],
    },
  });
  const [tableData, setTableData] = createStore(transformData(data));

  function getShiftsByBoxId(droppableBoxId: string): WorkSchedule[] {
    if (!tableData.cels.hasOwnProperty(droppableBoxId)) {
      return []; // Key does not exist in transformed data
    }

    const shiftIds = tableData.cels[droppableBoxId];

    const shifts = tableData.shifts.filter((shift) =>
      shiftIds.includes(shift.id)
    );

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
    for (let droppableBoxId in tableData.cels) {
      const shiftIds = tableData.cels[droppableBoxId];
      if (shiftIds.includes(draggableId as number)) {
        return droppableBoxId;
      }
    }

    return ""; // Shift ID not found
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
    const draggableContainer = getDroppableBoxId(draggable.id);
    const droppableContainer = isDroppableBoxId(droppable.id as string)
      ? (droppable.id as string)
      : getDroppableBoxId(droppable.id);

    if (
      draggableContainer != droppableContainer ||
      !onlyWhenChangingContainer
    ) {
      const containerItemIds = tableData.cels[droppableContainer];
      let index = containerItemIds.indexOf(droppable.id as number);
      if (index === -1) index = containerItemIds.length;

      batch(() => {
        setTableData("cels", draggableContainer, (items) =>
          items.filter((item) => item !== draggable.id)
        );
        setTableData("cels", droppableContainer, (items) => [
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
    <main>
      <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
      <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

      {/* Tool bar */}

      {/* Table */}
      <div class="w-full">
        <div class="min-w-[1024px]">
          {/* Header */}
          <div class="sticky top-0 z-30 flex shadow-sm border border-gray-200 rounded-t-md">
            <div class="sticky -left-6 z-30 px-3 py-2 flex flex-col justify-center border border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-[#f8fafc]"></div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Mon, Jun 5</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Tue, Jun 6</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Wed, Jun 7</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Thu, Jun 8</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Fri, Jun 9</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Sat, Jun 10</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
            <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-[#f8fafc]">
              <div class="font-semibold text-sm text-gray-500">Sun, Jun 11</div>
              <div class="font-normal text-sm text-gray-400">19.5 hrs / $0</div>
            </div>
          </div>

          {/* Drag container */}
          <div class="relative shadow-sm border border-gray-200">
            <DragDropProvider
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              collisionDetector={closestContainerOrItem}
            >
              <DragDropSensors />
              {/* Row */}
              <For each={Object.keys(data.staffs)}>
                {(staff) => (
                  <div class="flex">
                    <div class="sticky -left-6 px-3 py-1.5 flex flex-col border border-t-0 border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-[#f8fafc]">
                      <div class="font-semibold text-sm text-gray-500">
                        {staff}
                      </div>
                      <div class="font-normal text-sm text-gray-400">
                        0 hrs / $0
                      </div>
                    </div>
                    <For each={data.dates}>
                      {(date) => (
                        <Column
                          id={`${staff}-${date}`}
                          items={getShiftsByBoxId(`${staff}-${date}`)}
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
                    class="rounded mx-0.5 px-1.5 py-1 relative text-left bg-blue-200"
                  >
                    <i class="bg-blue-700 absolute top-1 left-1 bottom-1 w-1.5 rounded"></i>
                    <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
                    <p class="ml-3 font-normal text-xs text-gray-600">
                      Cashier {draggable?.id}
                    </p>
                  </button>
                )}
              </DragOverlay>
            </DragDropProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
