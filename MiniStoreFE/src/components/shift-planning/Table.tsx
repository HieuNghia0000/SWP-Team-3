import {
  CollisionDetector,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  Draggable,
  Droppable,
  Id,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import moment from "moment";
import { Component, For, Show, batch } from "solid-js";
import { Role, WorkSchedule } from "~/types";
import TableCel from "./TableCel";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { shiftTimes } from "./utils/shiftTimes";
import { celIdGenerator } from "./utils/celIdGenerator";
import { capitalize } from "~/utils/capitalize";

// a cel is a droppable box
// a shift is a draggable item

type DnDTableProps = {};

const Table: Component<DnDTableProps> = (props) => {
  const { setStaffModalData, setShowStaffModal } = useShiftPlanningModals();
  const { tableData, setTableData, fetchedData } = useSPData();

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

  // Get all droppable box ids
  const droppableBoxIds = () => Object.keys(tableData.cels);

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
              <div
                class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white"
                classList={{ "animate-pulse": fetchedData.loading }}
              >
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
                        {/* <span
                          class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
                          classList={{
                            "bg-blue-200 text-blue-700":
                              staff.role === Role.CASHIER,
                            "bg-yellow-200 text-yellow-700":
                              staff.role === Role.GUARD,
                            "bg-red-200 text-red-700":
                              staff.role === Role.MANAGER,
                            "bg-gray-200 text-gray-700":
                              staff.role === Role.ADMIN,
                          }}
                        > */}
                        {capitalize(staff.role)}
                        {/* </span> */}
                      </div>
                    </div>
                    <For each={tableData.dates}>
                      {(date) => (
                        <TableCel
                          id={celIdGenerator(staff, date)}
                          items={getShiftsByBoxId(celIdGenerator(staff, date))}
                          staff={staff}
                          date={date}
                        />
                      )}
                    </For>
                  </div>
                )}
              </For>

              <DragOverlay>
                {/* @ts-ignore */}
                {(draggable) => {
                  let item = () => draggable?.data?.item as WorkSchedule;
                  let isOrigin = () => draggable?.data?.isOrigin as boolean;
                  let selectedShiftWidth = () => draggable?.data?.width() - 4;
                  // let staff = () => draggable?.data?.staff as Staff;

                  return (
                    <button
                      type="button"
                      id={draggable?.id as string}
                      class="rounded mx-0.5 px-1.5 py-1 relative text-left"
                      style={{ width: `${selectedShiftWidth()}px` }}
                      classList={{
                        "bg-white hover:bg-[#edf2f7] text-black border border-gray-200":
                          item().published && isOrigin(),
                        "bg-blue-100 hover:bg-blue-200 text-blue-500 border border-blue-100":
                          item().published && !isOrigin(),
                        "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eff4f8_5px,#eff4f8_10px)] hover:bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
                          !item().published && isOrigin(),
                        "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] hover:bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#bfeaff_5px,#bfeaff_10px)] border border-blue-100":
                          !item().published && !isOrigin(),
                        "animate-pulse": fetchedData.loading,
                      }}
                    >
                      <i
                        class="absolute top-1 left-1 bottom-1 w-1.5 rounded"
                        classList={{
                          "bg-blue-700": item().shift.role === Role.CASHIER,
                          "bg-yellow-700": item().shift.role === Role.GUARD,
                          "bg-red-700": item().shift.role === Role.MANAGER,
                          "bg-gray-700": item().shift.role === Role.ADMIN,
                        }}
                      ></i>
                      <p class="ml-3 font-semibold text-sm">
                        {shiftTimes(
                          item().shift.startTime,
                          item().shift.endTime
                        )}
                      </p>
                      <p class="ml-3 font-normal text-xs text-gray-600">
                        {item().shift.shiftName}
                      </p>
                    </button>
                  );
                }}
              </DragOverlay>
            </DragDropProvider>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Table;
