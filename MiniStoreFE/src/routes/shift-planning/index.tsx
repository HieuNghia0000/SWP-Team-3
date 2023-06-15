import Breadcrumbs from "~/components/Breadcrumbs";
import {
  FaSolidAngleLeft,
  FaSolidAngleRight,
  FaSolidCheck,
  FaSolidPencil,
} from "solid-icons/fa";
import { createStore } from "solid-js/store";
import {
  Accessor,
  Component,
  Setter,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { Role, Staff } from "~/types";
import moment from "moment";
import { A, useRouteData, useSearchParams } from "@solidjs/router";
import routes from "~/utils/routes";
import flatpickr from "flatpickr";
import { FiCalendar } from "solid-icons/fi";
import { IoCopySharp } from "solid-icons/io";
import DropDownBtn from "~/components/DropDownBtn";
import PopupModal from "~/components/PopupModal";
import { Instance } from "flatpickr/dist/types/instance";
import {
  getWeekDateStings,
  getWeekFirstAndLastDates,
} from "~/utils/getWeekDates";
import { createRouteData } from "solid-start";
import Table from "~/components/DnD/Table";

export type WorkSchedule = {
  id: number; //unique id
  date: string;
  role: Role;
};
export interface ShiftPlanningData {
  dates: string[];
  staffs: Record<string, WorkSchedule[]>;
}
export type DataTable = {
  shifts: WorkSchedule[];
  cels: { [key: string]: number[] };
};

function transformData(data: ShiftPlanningData) {
  const transformedData: DataTable = { shifts: [], cels: {} };

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

type ParamType = {
  picked_date: string;
  from: string;
  to: string;
  rendition: "grid" | "list";
};

export function routeData() {
  const [searchParams] = useSearchParams();

  return createRouteData(
    async ([perPage, curPage]) => {
      // const response = await fetch(
      //   `https://hogwarts.deno.dev/students?perPage=${perPage}&curPage=${curPage}`
      // );
      // return await response.json();
      const data = {
        dates: getWeekDateStings(searchParams.picked_date),
        staffs: {
          "Open Shifts": [
            {
              id: 10,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.GUARD,
            },
            {
              id: 11,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.GUARD,
            },
            {
              id: 12,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.GUARD,
            },
          ],
          Hieu: [
            {
              id: 1,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
            {
              id: 2,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
            {
              id: 3,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
          ],
          Khoa: [
            {
              id: 4,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
            {
              id: 5,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
            {
              id: 6,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.MANAGER,
            },
          ],
          Nghia: [
            {
              id: 7,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.CASHIER,
            },
            {
              id: 8,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.CASHIER,
            },
            {
              id: 9,
              date: getWeekDateStings(searchParams.picked_date)[
                Math.floor(Math.random() * 7)
              ],
              role: Role.CASHIER,
            },
          ],
        },
      } as ShiftPlanningData;

      return data;
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}
export default function ShiftPlanning() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const data = useRouteData<typeof routeData>();
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;
  const [tableData, setTableData] = createStore<DataTable>({
    cels: {},
    shifts: [],
  });
  const [dateStr, setDateStr] = createSignal<string>("");

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<WorkSchedule>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  createEffect(() => {
    if (!data.loading && data() !== undefined)
      setTableData(transformData(data()!));
  });

  onMount(() => {
    const pickedDate = moment(searchParams.picked_date);
    fp = flatpickr(dateRef!, {
      mode: "single",
      dateFormat: "Y-m-d",
      defaultDate: pickedDate.isValid()
        ? pickedDate.format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      onChange: updateDateStr,
      onReady: updateDateStr,
    });
  });

  onCleanup(() => {
    fp?.destroy();
  });

  const updateDateStr = (
    selectedDates: Date[],
    dateStr: string,
    instance: Instance
  ) => {
    if (selectedDates.length === 0) {
      setSearchParams({
        picked_date: undefined,
        from: undefined,
        to: undefined,
      });
      setDateStr("");
    }
    if (selectedDates.length === 1) {
      const pickedDate = dateStr;
      const [from, to] = getWeekFirstAndLastDates(pickedDate);
      setSearchParams({
        from: from.format("YYYY-MM-DD"),
        to: to.format("YYYY-MM-DD"),
        picked_date: pickedDate,
      });
      const start = instance.formatDate(from.toDate(), "F j");
      const end = instance.formatDate(to.toDate(), "F j, Y");
      setDateStr(`${start} - ${end}`);
    }
  };

  const goToPrevWeek = () => {
    const pickedDate = moment(searchParams.picked_date);
    const [from, to] = getWeekFirstAndLastDates(
      pickedDate.subtract(1, "week").format()
    );
    fp?.setDate(from.toDate(), true);
  };

  const goToNextWeek = () => {
    const pickedDate = moment(searchParams.picked_date);
    const [from, to] = getWeekFirstAndLastDates(
      pickedDate.add(1, "week").format()
    );
    fp?.setDate(from.toDate(), true);
  };

  return (
    <ShiftPlanningContext.Provider
      value={{
        shiftModalData,
        setShiftModalData,
        showShiftModal,
        setShowShiftModal,
        showStaffModal,
        setShowStaffModal,
        staffModalData,
        setStaffModalData,
      }}
    >
      <main>
        <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
        <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

        {/* Tool bar */}
        <div class="mb-4 flex flex-row justify-between">
          <div class="flex flex-row gap-5 items-center">
            <div class="flex flex-row gap-1 bg-white border-gray-200 border rounded-lg p-1">
              <TableTypePicker
                active={() =>
                  searchParams.rendition === undefined ||
                  searchParams.rendition === "grid"
                }
                text="Grid"
                param="grid"
                cb={() => fp?.clear()}
              />
              <TableTypePicker
                active={() => searchParams.rendition === "list"}
                text="List"
                param="list"
                cb={() => fp?.clear()}
              />
            </div>
          </div>
          <div class="flex justify-center items-center gap-2">
            <button
              type="button"
              onClick={goToPrevWeek}
              class="flex justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
            >
              <FaSolidAngleLeft size={20} />
            </button>
            <button
              ref={dateRef}
              type="button"
              class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
            >
              <FiCalendar />
              {dateStr() || "Select Dates"}
            </button>
            <button
              type="button"
              onClick={goToNextWeek}
              class="flex justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
            >
              <FaSolidAngleRight size={20} />
            </button>
          </div>
          <div class="flex justify-center items-center gap-4">
            <button
              type="button"
              class="flex flex-row items-center gap-1 text-sm font-semibold text-white bg-indigo-600 py-2 px-3.5 rounded-lg hover:bg-indigo-700"
            >
              <span class="text-base">
                <FaSolidCheck />
              </span>
              Publish
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

        {/* Shift Planning Table */}
        <Table data={data} setTableData={setTableData} tableData={tableData} />
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
  );
}

type SPContext = {
  shiftModalData: Accessor<WorkSchedule | undefined>;
  setShiftModalData: Setter<WorkSchedule | undefined>;
  showShiftModal: Accessor<boolean>;
  setShowShiftModal: Setter<boolean>;
  staffModalData: Accessor<Staff | undefined>;
  setStaffModalData: Setter<Staff | undefined>;
  showStaffModal: Accessor<boolean>;
  setShowStaffModal: Setter<boolean>;
};
const ShiftPlanningContext = createContext<SPContext>();
export function useShiftPlanning(): SPContext {
  return useContext(ShiftPlanningContext)!;
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

function TableTypePicker(props: {
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
