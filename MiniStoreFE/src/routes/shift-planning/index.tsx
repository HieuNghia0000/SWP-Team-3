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
import { DataResponse, ShiftTemplate, Staff } from "~/types";
import { getWeekDateStings } from "~/utils/getWeekDates";
import getEndPoint from "~/utils/getEndPoint";
import toast from "solid-toast";
import {
  ModalContext,
  PageDataContext,
  ShiftCard,
} from "~/context/ShiftPlanning";
import { useSearchParams } from "solid-start";
import Spinner from "~/components/Spinner";
import NewShiftDetailsModal from "~/components/shift-planning/NewShiftDetailsModal";
import ShiftDetailsModal from "~/components/shift-planning/ShiftDetailsModal";
import ShiftTemplateModal from "~/components/shift-planning/ShiftTemplateModal";
import StaffDetailsModal from "~/components/shift-planning/StaffDetailsModal";
import Table from "~/components/shift-planning/Table";
import ToolBar from "~/components/shift-planning/ToolBar";
import { transformData } from "~/components/shift-planning/utils/dataTransformer";
import {
  DataTable,
  FetcherData,
  ParamType,
} from "~/components/shift-planning/utils/types";

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
    cells: {},
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
    shiftsRules: {},
  });

  const [showShiftModal, setShowShiftModal] = createSignal<boolean>(false);
  const [shiftModalData, setShiftModalData] = createSignal<ShiftCard>();

  const [showStaffModal, setShowStaffModal] = createSignal<boolean>(false);
  const [staffModalData, setStaffModalData] = createSignal<Staff>();

  const [showNewShiftModal, setShowNewShiftModal] =
    createSignal<boolean>(false);
  const [newShiftModalData, setNewShiftModalData] = createSignal<{
    staff: Staff;
    date: string;
  }>();

  const [showShiftTemplateModal, setShowShiftTemplateModal] =
    createSignal<boolean>(false);
  const [shiftTemplateModalData, setShiftTemplateModalData] =
    createSignal<ShiftTemplate>();

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
            cells: {},
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

  const resetTableData = () => {
    mutate({
      dates: [],
      staffs: [],
    });
    setTableData({
      cells: {},
      shifts: {},
      dates: [],
      staffs: [],
      changedShifts: {},
      preparingData: true,
      isErrored: false,
      shiftsRules: {},
      isChanged: false,
      originShifts: {},
    });
  };

  return (
    <PageDataContext.Provider
      value={{
        tableData,
        setTableData,
        fetchedData: data,
        resetTableData,
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
