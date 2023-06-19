import Breadcrumbs from "~/components/Breadcrumbs";
import { createStore } from "solid-js/store";
import {
  Accessor,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ResourceFetcher,
  Setter,
  useContext,
} from "solid-js";
import { DataResponse, Staff, WorkSchedule } from "~/types";
import moment from "moment";
import { getWeekDateStings } from "~/utils/getWeekDates";
import Table from "~/components/DnD/Table";
import getEndPoint from "~/utils/getEndPoint";
import toast from "solid-toast";
import ShiftDetailsModal from "~/components/DnD/ShiftDetailsModal";
import StaffDetailsModal from "~/components/DnD/StaffDetailsModal";
import ToolBar from "~/components/DnD/ToolBar";
import NewShiftDetailsModal from "~/components/DnD/NewShiftDetailsModal";

type SPContext = {
  shiftModalData: Accessor<WorkSchedule | undefined>;
  setShiftModalData: Setter<WorkSchedule | undefined>;
  showShiftModal: Accessor<boolean>;
  setShowShiftModal: Setter<boolean>;
  staffModalData: Accessor<Staff | undefined>;
  setStaffModalData: Setter<Staff | undefined>;
  showStaffModal: Accessor<boolean>;
  setShowStaffModal: Setter<boolean>;
  newShiftModalData: Accessor<WorkSchedule | undefined>;
  setNewShiftModalData: Setter<WorkSchedule | undefined>;
  showNewShiftModal: Accessor<boolean>;
  setShowNewShiftModal: Setter<boolean>;
};

const ShiftPlanningContext = createContext<SPContext>();

export function useShiftPlanning(): SPContext {
  return useContext(ShiftPlanningContext)!;
}

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

export type ParamType = {
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
  const [datePicked, setDatePicked] = createSignal<string>();
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

  // Because the data returned from the fetcher is a Signal, which is not good for manage complex state
  // So we need to transform the data to a Store for better state management
  const [tableData, setTableData] = createStore<DataTable>({
    cels: {},
    shifts: [],
    dates: [],
    staffs: [],
  });

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<WorkSchedule>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  const [showNewShiftModal, setShowNewShiftModal] =
    createSignal<boolean>(false);
  const [newShiftModalData, setNewShiftModalData] =
    createSignal<WorkSchedule>();

  createEffect(() => {
    // Because the data is fetched from the server, we need to wait for the data to be ready
    if (!data.loading && data.state === "ready")
      setTableData(transformData(data()));

    if (data.state === "errored" && datePicked() !== undefined) {
      setTableData({
        cels: {},
        shifts: [],
        dates: getWeekDateStings(datePicked()!),
        staffs: [],
      });

      toast.error("Error!", {
        duration: 2000,
        style: {
          color: "#dc2626",
          background: "#fecaca",
          border: "1px solid #b91c1c",
        },
      });
    }
  });

  return (
    <ShiftPlanningContext.Provider
      value={{
        // view shift
        shiftModalData,
        setShiftModalData,
        showShiftModal,
        setShowShiftModal,
        // view staff
        showStaffModal,
        setShowStaffModal,
        staffModalData,
        setStaffModalData,
        // new shift
        showNewShiftModal,
        setShowNewShiftModal,
        newShiftModalData,
        setNewShiftModalData,
      }}
    >
      <main>
        <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
        <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

        {/* Tool bar */}
        <ToolBar datePicked={datePicked} setDatePicked={setDatePicked} />

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
      <NewShiftDetailsModal
        showModal={showNewShiftModal}
        modalData={newShiftModalData}
        setShowModal={setShowNewShiftModal}
      />
    </ShiftPlanningContext.Provider>
  );
}
