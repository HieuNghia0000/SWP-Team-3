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
import { Shift } from "~/types";
import TableCell from "./TableCell";
import { useShiftPlanningModals, useSPData } from "~/context/ShiftPlanning";
import { shiftTimes } from "./utils/shiftTimes";
import { cellIdGenerator } from "./utils/cellIdGenerator";
import { capitalize } from "~/utils/capitalize";
import ShiftCard from "./ShiftCard";
import { sortBy } from "lodash";
import toast from "solid-toast";
import { getShiftMoveErrors } from "./utils/shiftRules";
import getShiftsByCellId from "./utils/getShiftsByCellId";

// a cell is a droppable box
// a shift is a draggable item

type DnDTableProps = {};

const Table: Component<DnDTableProps> = (props) => {
  const { setStaffModalData, setShowStaffModal } = useShiftPlanningModals();
  const { tableData, setTableData, fetchedData } = useSPData();

  // Get all droppable box ids
  const cellIds = () => Object.keys(tableData.cells);

  // Check if the id is a droppable box id
  const isCellId = (id: string) => cellIds().includes(id);

  // Find the droppable box id of a draggable id
  const getCellId = (shiftCardId: Id) => {
    for (let cellId in tableData.cells) {
      const shiftIds = tableData.cells[cellId];
      if (shiftIds.includes(shiftCardId as number)) {
        return cellId;
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
      droppables.filter((droppable) => isCellId(droppable.id as string)),
      context
    );
    if (closestContainer) {
      const containerItemIds = tableData.cells[closestContainer.id];
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

      if (getCellId(draggable.id) !== closestContainer.id) {
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
    const draggableContainerId = getCellId(draggable.id);
    // Get the droppable box id of the droppable
    const droppableId = isCellId(droppable.id as string)
      ? (droppable.id as string)
      : getCellId(droppable.id);

    if (draggableContainerId != droppableId || !onlyWhenChangingContainer) {
      const errors = getShiftMoveErrors(draggable, droppable, tableData);
      if (errors.length > 0) {
        for (let error of errors) {
          toast.error(error.errorName, {
            duration: 2000,
            style: {
              color: "#dc2626",
              background: "#fecaca",
              border: "1px solid #b91c1c",
            },
          });
        }
        return;
      }

      batch(() => {
        setTableData("cells", draggableContainerId, (items) =>
          items.filter((item) => item !== draggable.id)
        );
        setTableData("cells", droppableId, (items) => {
          const sortedShifts = sortBy(
            [...items, draggable.id as number],
            [(shiftId) => tableData.shifts[shiftId].shiftTemplate.startTime]
          );
          return [...sortedShifts];
        });
      });
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
                  19.5 hrs / 0₫
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Body - Drag container */}
        <div class="relative shadow-sm border border-gray-200 border-t-0">
          <Show when={tableData.staffs.length !== 0}>
            <DragDropProvider
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
                        {capitalize(staff.role)}
                      </div>
                    </div>
                    <For each={tableData.dates}>
                      {(date) => (
                        <TableCell
                          id={cellIdGenerator(staff, date)}
                          items={getShiftsByCellId(
                            cellIdGenerator(staff, date),
                            tableData
                          )}
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
                  let item = () => draggable?.data?.item as Shift;
                  let isOrigin = () => draggable?.data?.isOrigin as boolean;
                  let selectedShiftWidth = () => draggable?.data?.width() - 4;
                  let isErrored = () =>
                    tableData.shiftsRules[
                      (draggable?.data.item as Shift).shiftId
                    ].find((rule) => !rule.passed) !== undefined;

                  return (
                    <ShiftCard
                      isOrigin={isOrigin()}
                      published={item().published}
                      loading={fetchedData.loading}
                      role={item().shiftTemplate.role}
                      shiftDuration={shiftTimes(
                        item().shiftTemplate.startTime,
                        item().shiftTemplate.endTime
                      )}
                      shiftName={item().shiftTemplate.name}
                      style={{ width: `${selectedShiftWidth()}px` }}
                      isOverlay={true}
                      isErrored={isErrored()}
                    />
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
