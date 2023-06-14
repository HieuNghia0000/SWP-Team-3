import Breadcrumbs from "~/components/Breadcrumbs";
import { FaSolidCheck, FaSolidPencil } from "solid-icons/fa";
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
import {
  Accessor,
  Component,
  For,
  Setter,
  Show,
  batch,
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { Role, Staff, Status } from "~/types";
import moment from "moment";
import { A, useSearchParams } from "@solidjs/router";
import routes from "~/utils/routes";
import flatpickr from "flatpickr";
import { RiSystemCloseLine } from "solid-icons/ri";
import { FiCalendar } from "solid-icons/fi";
import { IoCopySharp } from "solid-icons/io";
import DropDownBtn from "~/components/DropDownBtn";
import PopupModal from "~/components/PopupModal";

type WorkSchedule = {
  id: number; //unique id
  date: string;
  role: Role;
};
interface ShiftPlanningData {
  dates: string[];
  staffs: Record<string, WorkSchedule[]>;
}

type SPContext = {
  shiftModalData: Accessor<WorkSchedule | undefined>;
  setShiftModalData: Setter<WorkSchedule | undefined>;
  showModal: Accessor<boolean>;
  setShowModal: Setter<boolean>;
};
const ShiftPlanningContext = createContext<SPContext>();

function useShiftPlanning(): SPContext {
  return useContext(ShiftPlanningContext)!;
}

const Sortable: Component<{
  item: WorkSchedule;
  width: () => number | undefined;
}> = ({ item, width }) => {
  const { setShiftModalData, setShowModal } = useShiftPlanning();
  const sortable = createSortable(item.id, {
    width: width,
    shift: item,
  });

  return (
    <button
      // @ts-ignore
      use:sortable
      type="button"
      id={item.id.toString()}
      onClick={() => {
        setShiftModalData(item);
        setShowModal(true);
      }}
      class="rounded mx-0.5 px-1.5 py-1 relative text-left"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "bg-blue-100 hover:bg-blue-200": item.role === Role.CASHIER,
        "bg-yellow-100 hover:bg-yellow-200": item.role === Role.GUARD,
        "bg-red-100 hover:bg-red-200": item.role === Role.MANAGER,
        "bg-gray-100 hover:bg-gray-200": item.role === Role.ADMIN,
      }}
    >
      <i
        class="bg-blue-700 absolute top-1 left-1 bottom-1 w-1.5 rounded"
        classList={{
          "bg-blue-500": item.role === Role.CASHIER,
          "bg-yellow-500": item.role === Role.GUARD,
          "bg-red-500": item.role === Role.MANAGER,
          "bg-gray-500": item.role === Role.ADMIN,
        }}
      ></i>
      <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
      <p class="ml-3 font-normal text-xs text-gray-600">Cashier {item.id}</p>
    </button>
  );
};

const Column: Component<{
  id: string;
  items: WorkSchedule[];
}> = (props) => {
  const droppable = createDroppable(props.id);
  0 && droppable;
  let divRef: HTMLDivElement | undefined = undefined;

  return (
    <div
      // @ts-ignore
      use:droppable
      ref={divRef}
      class="flex flex-col border-r border-b border-gray-200 flex-1 overflow-hidden bg-[#f8fafc] pt-0.5 gap-y-0.5"
    >
      <SortableProvider ids={props.items.map((item) => item.id)}>
        <For each={props.items}>
          {(item) => <Sortable item={item} width={() => divRef?.offsetWidth} />}
        </For>
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

export default function ShiftPlanning() {
  const [data, setData] = createStore<ShiftPlanningData>({
    dates: ["1", "2", "3", "4", "5", "6", "7"],
    staffs: {
      "Open Shifts": [
        { id: 10, date: "1", role: Role.GUARD },
        { id: 11, date: "2", role: Role.GUARD },
        { id: 12, date: "1", role: Role.GUARD },
      ],
      Hieu: [
        { id: 1, date: "2", role: Role.MANAGER },
        { id: 2, date: "1", role: Role.MANAGER },
        { id: 3, date: "1", role: Role.MANAGER },
      ],
      Khoa: [
        { id: 4, date: "5", role: Role.MANAGER },
        { id: 5, date: "4", role: Role.MANAGER },
        { id: 6, date: "5", role: Role.MANAGER },
      ],
      Nghia: [
        { id: 7, date: "3", role: Role.CASHIER },
        { id: 8, date: "4", role: Role.CASHIER },
        { id: 9, date: "1", role: Role.CASHIER },
      ],
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;
  const [tableData, setTableData] = createStore(transformData(data));
  const [dateStr, setDateStr] = createSignal<string>("");

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<WorkSchedule>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  onMount(() => {
    fp = flatpickr(dateRef!, {
      mode: "range",
      dateFormat: "M-d-Y",
      onClose: (selectedDates, dateStr, instance) => {
        if (selectedDates.length === 0) {
          setSearchParams({ from: undefined, to: undefined });
        }
        if (selectedDates.length === 2) {
          const start = instance.formatDate(selectedDates[0], "Y-m-d");
          const end = instance.formatDate(selectedDates[1], "Y-m-d");
          if (start && end) {
            setSearchParams({
              from: start,
              to: end,
            });
          }
          setDateStr(dateStr);
        }
      },
      onChange: (selectedDates, dateStr) => {
        if (selectedDates.length === 0) {
          setDateStr("");
        }
        if (selectedDates.length === 2) {
          setDateStr(dateStr);
        }
      },
    });
  });

  onCleanup(() => {
    fp?.destroy();
  });

  function getShiftsByBoxId(droppableBoxId: string) {
    if (!tableData.cels.hasOwnProperty(droppableBoxId)) {
      return []; // Key does not exist in transformed data
    }

    const shiftIds = tableData.cels[droppableBoxId];

    const shifts = [];
    for (let shiftId of shiftIds) {
      const shift = tableData.shifts.find((shift) => shift.id === shiftId);
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
    <>
      <ShiftPlanningContext.Provider
        value={{
          shiftModalData,
          setShiftModalData,
          showModal: showShiftModal,
          setShowModal: setShowShiftModal,
        }}
      >
        <main>
          <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
          <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

          {/* Tool bar */}
          <div class="mb-4 flex flex-row justify-between">
            <div class="flex flex-row gap-5 items-center">
              <div class="flex flex-row gap-1 bg-white border-gray-200 border rounded-lg p-1">
                <DateRangeButton
                  active={() =>
                    searchParams.rendition === undefined ||
                    searchParams.rendition === "grid"
                  }
                  text="Grid"
                  param="grid"
                  cb={() => fp?.clear()}
                />
                <DateRangeButton
                  active={() => searchParams.rendition === "list"}
                  text="List"
                  param="list"
                  cb={() => fp?.clear()}
                />
              </div>
            </div>
            <div class="flex justify-center items-center mr-5 gap-4">
              <button
                type="button"
                class="flex flex-row items-center gap-1 text-sm font-semibold text-white bg-indigo-600 py-2 px-3.5 rounded-lg hover:bg-indigo-700"
              >
                <span class="text-base">
                  <FaSolidCheck />
                </span>
                Publish
              </button>
              <Show when={dateStr()}>
                <div class="flex justify-center items-center gap-2">
                  <button
                    class="text-base hover:text-indigo-700"
                    onClick={() => {
                      setSearchParams({
                        ago: undefined,
                        from: undefined,
                        to: undefined,
                      });
                      fp?.clear();
                    }}
                  >
                    <RiSystemCloseLine />
                  </button>
                  <label class="text-gray-500 font-medium">{dateStr()}</label>
                </div>
              </Show>
              <button
                ref={dateRef}
                type="button"
                class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
              >
                <FiCalendar />
                Select Dates
              </button>
              <DropDownBtn text="Copy" icon={<IoCopySharp />}>
                <A
                  href="/"
                  class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
                >
                  Copy Previous Week
                </A>
                <A
                  href="/"
                  class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
                >
                  Create Week Template
                </A>
                <A
                  href="/"
                  class="py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap block"
                >
                  Apply Week Template
                </A>
              </DropDownBtn>
            </div>
          </div>

          {/* Table */}
          <div class="w-full">
            <div class="min-w-[1024px]">
              {/* Header */}
              <div class="sticky top-0 z-30 flex shadow-sm border border-gray-200 rounded-t-md">
                <div class="sticky left-0 z-30 px-3 py-2 flex flex-col justify-center border border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-white"></div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Mon, Jun 5
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Tue, Jun 6
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Wed, Jun 7
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Thu, Jun 8
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Fri, Jun 9
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Sat, Jun 10
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
                </div>
                <div class="px-3 py-2 flex flex-col justify-center border border-gray-200 flex-1 items-center overflow-hidden bg-white">
                  <div class="font-semibold text-sm text-gray-600">
                    Sun, Jun 11
                  </div>
                  <div class="font-normal text-sm text-gray-400">
                    19.5 hrs / $0
                  </div>
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
                        <div class="sticky left-0 z-10 px-3 py-1.5 flex flex-col border border-t-0 border-gray-200 w-52 flex-auto flex-grow-0 flex-shrink-0 overflow-visible bg-white">
                          <button
                            onClick={() => {
                              // setStaffModalData(staff);
                              setShowStaffModal(true);
                            }}
                            class="font-semibold text-sm text-gray-600 text-start"
                          >
                            {staff}
                          </button>
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
                        class="rounded mx-0.5 px-1.5 py-1 relative text-left"
                        style={{ width: `${draggable?.data?.width()}px` }}
                        classList={{
                          "bg-blue-200":
                            (draggable?.data.shift as WorkSchedule).role ===
                            Role.CASHIER,
                          "bg-yellow-200":
                            (draggable?.data.shift as WorkSchedule).role ===
                            Role.GUARD,
                          "bg-red-200":
                            (draggable?.data.shift as WorkSchedule).role ===
                            Role.MANAGER,
                          "bg-gray-200":
                            (draggable?.data.shift as WorkSchedule).role ===
                            Role.ADMIN,
                        }}
                      >
                        <i
                          class="bg-blue-700 absolute top-1 left-1 bottom-1 w-1.5 rounded"
                          classList={{
                            "bg-blue-700":
                              (draggable?.data.shift as WorkSchedule).role ===
                              Role.CASHIER,
                            "bg-yellow-700":
                              (draggable?.data.shift as WorkSchedule).role ===
                              Role.GUARD,
                            "bg-red-700":
                              (draggable?.data.shift as WorkSchedule).role ===
                              Role.MANAGER,
                            "bg-gray-700":
                              (draggable?.data.shift as WorkSchedule).role ===
                              Role.ADMIN,
                          }}
                        ></i>
                        <p class="ml-3 font-semibold text-sm">9am - 5pm</p>
                        <p class="ml-3 font-normal text-xs text-gray-600">
                          Cashier {(draggable?.data.shift as WorkSchedule).id}
                        </p>
                      </button>
                    )}
                  </DragOverlay>
                </DragDropProvider>
              </div>
            </div>
          </div>
        </main>

        {/* <!-- Modal panel, show/hide based on modal state. --> */}
        <ShiftDetailsModal
          showModal={showShiftModal}
          modalData={shiftModalData}
          setShowModal={setShowShiftModal}
        />
        <StaffDetailsModal
          showModal={showStaffModal}
          modalData={staffModalData}
          setShowModal={setShowStaffModal}
        />
      </ShiftPlanningContext.Provider>
    </>
  );
}

const ShiftDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<WorkSchedule | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  return (
    <PopupModal
      title="Shift Details"
      close={() => setShowModal(false)}
      open={showModal}
      footer={
        <A
          href={routes.staffEdit(1)}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Shift
        </A>
      }
    >
      <div class="text-lg mb-2.5 font-semibold text-center text-gray-800">
        Hieu Vo
      </div>
      <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Team Member:</span>
            <span>Hieu Vo</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Hourly Wage:</span>
            <span>$0.00</span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Role:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-red-700 rounded-full"
              classList={{
                "bg-red-200": true,
              }}
            >
              Manager
            </span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Date:</span>
            <span>Mon Jun 5, 2023</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Start Time:</span>
            <span>12:00pm</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">End Time:</span>
            <span>6:00pm</span>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Status:</span>
            <span>Not yet</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Check-in Time:</span>
            <span>Not yet</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Check-out Time:</span>
            <span>Not yet</span>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

const StaffDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<Staff | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  return (
    <PopupModal
      title="Staff Details"
      close={() => setShowModal(false)}
      open={showModal}
      footer={
        <A
          href={routes.staffEdit(1)}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Staff
        </A>
      }
    >
      <div class="text-lg mb-2.5 font-semibold text-center text-gray-800">
        Hieu Vo
      </div>
      <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Email:</span>
            <span>voanhhieu10250@gmail.com</span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Phone Number:</span>
            <span>0987654321</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Hourly Wage:</span>
            <span>$0.00</span>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Role:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-red-700 rounded-full"
              classList={{
                "bg-red-200": true,
              }}
            >
              Manager
            </span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Status:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-white rounded-full"
              classList={{
                "bg-green-500": true,
              }}
            >
              {true ? "Activated" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

function DateRangeButton(props: {
  active: () => boolean;
  text: string;
  param?: string;
  cb: () => void;
}) {
  const { active, text, param, cb } = props;
  const [, setSearchParams] = useSearchParams();

  return (
    <button
      class="py-1.5 px-3 font-semibold rounded-md text-sm"
      classList={{
        "bg-indigo-100 text-indigo-700": active(),
        "text-gray-500 hover:bg-indigo-50": !active(),
      }}
      onClick={() => {
        setSearchParams({ rendition: param });
        cb();
      }}
    >
      {text}
    </button>
  );
}
