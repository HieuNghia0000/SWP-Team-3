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
  createContext,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  ResourceFetcher,
  Setter,
  useContext,
} from "solid-js";
import { DataResponse, Role, Staff, Status, WorkSchedule } from "~/types";
import moment from "moment";
import { A, useSearchParams } from "@solidjs/router";
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
import Table from "~/components/DnD/Table";
import getEndPoint from "~/utils/getEndPoint";

export interface ShiftPlanningData {
  dates: string[];
  staffs: Staff[];
}
export interface DataTable extends ShiftPlanningData {
  shifts: WorkSchedule[];
  cels: { [key: string]: number[] };
}

function transformData(data: ShiftPlanningData): DataTable {
  const transformedData: DataTable = {
    shifts: [],
    cels: {},
    dates: data.dates,
    staffs: data.staffs,
  };

  if (data.staffs.length === 0) return transformedData;

  for (let staff of data.staffs) {
    for (let shift of staff.workSchedule) {
      transformedData.shifts.push({
        ...shift,
        staff: { ...staff, workSchedule: [] },
      });
    }

    for (let date of data.dates) {
      const celId = `${staff.username}-${date}`;
      const matchingShifts = staff.workSchedule.filter((s) =>
        moment(s.date).isSame(date, "day")
      );

      if (!transformedData.cels.hasOwnProperty(celId)) {
        transformedData.cels[celId] = [];
      }

      for (let shift of matchingShifts) {
        transformedData.cels[celId].push(shift.scheduleId);
      }
    }
  }

  return transformedData;
}

type ParamType = {
  rendition: "grid" | "list";
  picked_date: string;
};

const fetchShiftPlanningData: ResourceFetcher<
  boolean | string,
  ShiftPlanningData
> = async (source) => {
  const dates = getWeekDateStings(source as string);
  const from = dates[0];
  const to = dates[dates.length - 1];

  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(
    `http://localhost:3000/shift-planning-${source}.json`
  );
  const data: DataResponse<Staff[]> = await response.json();

  return {
    dates,
    staffs: data.content,
  };
};

export default function ShiftPlanning() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const [datePicked, setDatePicked] = createSignal<string>(
    searchParams.picked_date
  );
  const [data, { refetch, mutate }] = createResource(
    datePicked,
    fetchShiftPlanningData,
    {
      initialValue: {
        dates: [],
        staffs: [],
      },
    }
  );
  const [tableData, setTableData] = createStore<DataTable>({
    cels: {},
    shifts: [],
    dates: [],
    staffs: [],
  });
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;
  const [dateStr, setDateStr] = createSignal<string>("");

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<WorkSchedule>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  createEffect(() => {
    // console.log(data.loading, data.state, data());
    if (!data.loading && data.state === "ready")
      setTableData(transformData(data()));
  });

  onMount(() => {
    const pickedDateM = moment(searchParams.picked_date);
    const defaultDate = pickedDateM.isValid()
      ? pickedDateM.format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    setDatePicked(defaultDate);
    fp = flatpickr(dateRef!, {
      mode: "single",
      dateFormat: "Y-m-d",
      defaultDate: defaultDate,
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
      setDatePicked("");
      setSearchParams({ picked_date: undefined });
      setDateStr("");
    }
    if (selectedDates.length === 1) {
      const pickedDate = dateStr;
      const [from, to] = getWeekFirstAndLastDates(pickedDate);
      setDatePicked(pickedDate);
      setSearchParams({ picked_date: pickedDate });
      const start = instance.formatDate(from.toDate(), "F j");
      const end = instance.formatDate(to.toDate(), "F j, Y");
      setDateStr(`${start} - ${end}`);
    }
  };

  const goToPrevWeek = () => {
    const pickedDate = moment(datePicked()!);
    const [from] = getWeekFirstAndLastDates(
      pickedDate.subtract(1, "week").format()
    );
    fp?.setDate(from.toDate(), true);
  };

  const goToNextWeek = () => {
    const pickedDate = moment(datePicked()!);
    const [from] = getWeekFirstAndLastDates(pickedDate.add(1, "week").format());
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
        <Table setTableData={setTableData} tableData={tableData} />
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
          href={"/"}
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
        {modalData()?.shift.shiftName}
      </div>
      <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Team Member:</span>
            <span>{modalData()?.staff?.staffName}</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Salary Coefficient:</span>
            <span>{modalData()?.shift.salaryCoefficient}</span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Role:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
              classList={{
                "bg-blue-200 text-blue-700":
                  modalData()?.shift.role === Role.CASHIER,
                "bg-yellow-200 text-yellow-700":
                  modalData()?.shift.role === Role.GUARD,
                "bg-red-200 text-red-700":
                  modalData()?.shift.role === Role.MANAGER,
                "bg-gray-200 text-gray-700":
                  modalData()?.shift.role === Role.ADMIN,
              }}
            >
              {modalData()?.shift.role}
            </span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Date:</span>
            <span>{moment(modalData()?.date).format("ddd MMM D, YYYY")}</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Start Time:</span>
            <span>
              {moment(modalData()?.shift.startTime, "h:mm:ss").format("h:mma")}
            </span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">End Time:</span>
            <span>
              {moment(modalData()?.shift.endTime, "h:mm:ss").format("h:mma")}
            </span>
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
          href={routes.staffEdit(modalData()?.staffId ?? 0)}
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
        {modalData()?.staffName}
      </div>
      <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Email:</span>
            <span>{modalData()?.email}</span>
          </div>
        </div>
        <div class="flex border-b border-gray-300 border-dotted">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Phone Number:</span>
            <span>{modalData()?.phoneNumber}</span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Hourly Wage:</span>
            <span>{modalData()?.baseSalary}</span>
          </div>
        </div>
        <div class="flex">
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Role:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
              classList={{
                "bg-blue-200 text-blue-700": modalData()?.role === Role.CASHIER,
                "bg-yellow-200 text-yellow-700":
                  modalData()?.role === Role.GUARD,
                "bg-red-200 text-red-700": modalData()?.role === Role.MANAGER,
                "bg-gray-200 text-gray-700": modalData()?.role === Role.ADMIN,
              }}
            >
              {modalData()?.role}
            </span>
          </div>
          <div class="flex-1 py-2.5 overflow-hidden space-x-1">
            <span class="font-semibold text-gray-500">Status:</span>
            <span
              class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-white rounded-full"
              classList={{
                "bg-green-500": modalData()?.status === Status.ACTIVATED,
                "bg-red-500": modalData()?.status === Status.DISABLED,
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
