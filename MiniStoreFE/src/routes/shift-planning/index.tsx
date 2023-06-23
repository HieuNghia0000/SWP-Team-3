import Breadcrumbs from "~/components/Breadcrumbs";
import { createStore } from "solid-js/store";
import {
  createEffect,
  createResource,
  createSignal,
  on,
  ResourceFetcher,
  Show,
} from "solid-js";
import { DataResponse, Shift, Staff, WorkSchedule } from "~/types";
import moment from "moment";
import { getWeekDateStings } from "~/utils/getWeekDates";
import getEndPoint from "~/utils/getEndPoint";
import toast from "solid-toast";
import { ModalContext, PageDataContext } from "~/context/ShiftPlanning";
import { useSearchParams } from "solid-start";
import Spinner from "~/components/Spinner";
import NewShiftDetailsModal from "~/components/shift-planning/NewShiftDetailsModal";
import ShiftDetailsModal from "~/components/shift-planning/ShiftDetailsModal";
import ShiftTemplateModal from "~/components/shift-planning/ShiftTemplateModal";
import StaffDetailsModal from "~/components/shift-planning/StaffDetailsModal";
import Table from "~/components/shift-planning/Table";
import ToolBar from "~/components/shift-planning/ToolBar";

export type ParamType = {
  rendition: "grid" | "list";
  picked_date: string;
};
export interface FetcherData {
  dates: string[];
  staffs: Staff[];
}

export interface DataTable extends FetcherData {
  originShifts: { [key: WorkSchedule["scheduleId"]]: WorkSchedule };
  shifts: { [key: WorkSchedule["scheduleId"]]: WorkSchedule };
  cels: { [key: string]: WorkSchedule["scheduleId"][] };
  isErrored: boolean;
  preparingData: boolean;
  isChanged: boolean;
  changedShifts: { [key: WorkSchedule["scheduleId"]]: boolean };
}

export const celIdGenerator = (staff: Staff, date: string) =>
  `${staff.username}-${date}`;

export function shiftTimes(startTime: string, endTime: string) {
  const format = "h:mma"; // Time format: 12-hour clock with minutes

  const start = moment(startTime, "HH:mm:ss");
  const end = moment(endTime, "HH:mm:ss");

  const formattedStart = start.format(format).replace(":00", "");
  const formattedEnd = end.format(format).replace(":00", "");

  return `${formattedStart} - ${formattedEnd}`;
}

// TODO: add another transform function to transform data fetched from add new shift endpoint
// without losing the current data
function transformData(data: FetcherData): DataTable {
  const transformedData: DataTable = {
    originShifts: {},
    shifts: {},
    cels: {},
    dates: data.dates,
    staffs: data.staffs,
    changedShifts: {},
    isChanged: false,
    isErrored: false,
    preparingData: false,
  };

  if (data.staffs.length === 0) return transformedData;

  for (let staff of data.staffs) {
    for (let shift of staff.workSchedule) {
      transformedData.shifts[shift.scheduleId] = { ...shift };
      transformedData.originShifts[shift.scheduleId] = { ...shift };
      transformedData.changedShifts[shift.scheduleId] = false;
    }

    for (let date of data.dates) {
      const celId = celIdGenerator(staff, date);
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
const fetcher: ResourceFetcher<boolean | string, FetcherData> = async (
  source
) => {
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
  const [datePicked, setDatePicked] = createSignal<string>();
  const [data, { refetch, mutate }] = createResource(datePicked, fetcher, {
    initialValue: {
      dates: [],
      staffs: [],
    },
  });

  // Because the data returned from the fetcher is a Signal, which is not good for manage complex state
  // So we need to transform the data to a Store for better state management
  const [tableData, setTableData] = createStore<DataTable>({
    cels: {},
    shifts: {},
    originShifts: {},
    dates: [],
    staffs: [],
    changedShifts: {},
    get isChanged() {
      return Object.values(this.changedShifts).some((v) => v);
    },
    preparingData: true,
    isErrored: false,
  });

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<WorkSchedule>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  const [showNewShiftModal, setShowNewShiftModal] =
    createSignal<boolean>(false);
  const [newShiftModalData, setNewShiftModalData] =
    createSignal<WorkSchedule>();

  const [showShiftTemplateModal, setShowShiftTemplateModal] =
    createSignal<boolean>(false);
  const [shiftTemplateModalData, setShiftTemplateModalData] =
    createSignal<Shift>();

  createEffect(
    on(
      () => data.state,
      () => {
        // Because the data is fetched from the server, we need to wait for the data to be ready
        if (!data.loading && data.state === "ready") {
          const tData = transformData(data());
          setTableData(tData);
        }

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
      }
    )
  );

  return (
    <PageDataContext.Provider
      value={{
        tableData,
        setTableData,
        fetchedData: data,
      }}
    >
      <ModalContext.Provider
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
          // shift template
          showShiftTemplateModal,
          setShowShiftTemplateModal,
          shiftTemplateModalData,
          setShiftTemplateModalData,
        }}
      >
        <main>
          <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
          <Breadcrumbs linkList={[{ name: "Shift Planning" }]} />

          {/* Tool bar */}
          <ToolBar datePicked={datePicked} setDatePicked={setDatePicked} />

          <Show when={searchParams.rendition === undefined}>
            {/* Shift Planning Table */}
            <Show
              when={!tableData.preparingData}
              fallback={
                <div class="w-full min-w-[1024px] min-h-[300px] grid place-items-center">
                  <Spinner />
                </div>
              }
            >
              <Table />
            </Show>
          </Show>
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
        <ShiftTemplateModal
          showModal={showShiftTemplateModal}
          modalData={shiftTemplateModalData}
          setShowModal={setShowShiftTemplateModal}
        />
      </ModalContext.Provider>
    </PageDataContext.Provider>
  );
}
