import Breadcrumbs from "~/components/Breadcrumbs";
import { createStore } from "solid-js/store";
import { createEffect, createResource, createSignal, on, ResourceFetcher, Show } from "solid-js";
import { DataResponse, ShiftTemplate, Staff } from "~/types";
import { getWeekDateStings } from "~/utils/getWeekDates";
import getEndPoint from "~/utils/getEndPoint";
import { ModalContext, PageDataContext, ShiftCard } from "~/context/ShiftPlanning";
import Spinner from "~/components/Spinner";
import NewShiftModal from "~/components/shift-planning/NewShiftModal";
import ShiftDetailsModal from "~/components/shift-planning/ShiftDetailsModal";
import ShiftTemplateModal from "~/components/shift-planning/ShiftTemplateModal";
import StaffDetailsModal from "~/components/shift-planning/StaffDetailsModal";
import Table from "~/components/shift-planning/Table";
import ToolBar from "~/components/shift-planning/ToolBar";
import { transformData } from "~/components/shift-planning/utils/dataTransformer";
import { DataTable, FetcherData } from "~/components/shift-planning/utils/types";
import ScheduleTemplateModal from "~/components/shift-planning/ScheduleTemplateModal";
import axios from "axios";
import handleFetchError from "~/utils/handleFetchError";
import CreateCoverRequestModal from "~/components/cover-requests/CreateCoverRequestModal";

const fetcher: ResourceFetcher<boolean | string, FetcherData> = async (
  source
) => {
  try {
    const dates = getWeekDateStings(source as string);
    const from = dates[0];
    const to = dates[dates.length - 1];

    const response = await axios.get<DataResponse<Staff[]>>(
      `${getEndPoint()}/shift-planning?from=${from}&to=${to}`
    );

    return {
      dates,
      staffs: response.data.content,
    };
  } catch (e) {
    throw new Error(handleFetchError(e));
  }
};

export default function ShiftPlanning() {
  const [ datePicked, setDatePicked ] = createSignal<string | undefined>();

  // Be careful with this. You should always check for error before reading the data
  const [ data, { refetch, mutate } ] = createResource(datePicked, fetcher, {
    initialValue: {
      dates: [],
      staffs: [],
    },
  });

  // Because the data returned from the fetcher is a Signal, which is not good for manage complex state
  // So we need to transform the data to a Store for better state management
  const [ tableData, setTableData ] = createStore<DataTable>({
    cells: {},
    cellInfos: {},
    shifts: {},
    dates: [],
    staffs: [],
    shiftsRules: {},
    leaveRequests: [],
  });

  const [ showShiftModal, setShowShiftModal ] = createSignal<boolean>(false);
  const [ shiftModalData, setShiftModalData ] = createSignal<ShiftCard>();

  const [ showStaffModal, setShowStaffModal ] = createSignal<boolean>(false);
  const [ staffModalData, setStaffModalData ] = createSignal<Staff>();

  const [ showNewShiftModal, setShowNewShiftModal ] =
    createSignal<boolean>(false);
  const [ newShiftModalData, setNewShiftModalData ] = createSignal<{
    staff: Staff;
    date: string;
  }>();

  const [ showShiftTemplateModal, setShowShiftTemplateModal ] =
    createSignal<boolean>(false);
  const [ shiftTemplateModalData, setShiftTemplateModalData ] =
    createSignal<ShiftTemplate>();

  const [ scheduleTemplateModalState, setScheduleTemplateModalState ] =
    createSignal<"list" | "copy" | "create" | "apply">();

  const [ showCreateCoverModal, setShowCreateCoverModal ] = createSignal<boolean>(false);

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
            cellInfos: {},
            shiftsRules: {},
            shifts: [],
            dates: getWeekDateStings(datePicked()!),
            staffs: [],
            leaveRequests: [],
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
      cellInfos: {},
      shifts: {},
      dates: [],
      staffs: [],
      shiftsRules: {},
      leaveRequests: [],
    });
  };

  const saveChanges = async () => {
    refetch();
  };

  const isRouteDataLoading = () => data.loading;

  return (
    <PageDataContext.Provider
      value={{
        tableData,
        setTableData,
        isRouteDataLoading,
        resetTableData,
        saveChanges
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
          // schedule template
          scheduleTemplateModalState,
          setScheduleTemplateModalState,
          // shift cover request
          showCreateCoverModal,
          setShowCreateCoverModal
        }}
      >
        <main>
          <h1 class="mb-2 text-2xl font-medium">Shift planning</h1>
          <Breadcrumbs linkList={[ { name: "Shift Planning" } ]}/>

          {/* Tool bar */}
          <ToolBar datePicked={datePicked} setDatePicked={setDatePicked}/>

          {/* Shift Planning Table */}
          <Show
            when={tableData.dates.length > 0}
            fallback={
              <div class="w-full min-w-[1024px] min-h-[300px] grid place-items-center">
                <Spinner/>
              </div>
            }
          >
            <Table/>
          </Show>
        </main>

        {/* <!-- Modal panel, show/hide based on modal state. --> */}
        <ShiftDetailsModal
          showModal={showShiftModal}
          modalData={shiftModalData}
          setShowModal={setShowShiftModal}
          setShiftModalData={setShiftModalData}
        />
        <StaffDetailsModal
          showModal={showStaffModal}
          modalData={staffModalData}
          setShowModal={setShowStaffModal}
        />
        <NewShiftModal
          showModal={showNewShiftModal}
          modalData={newShiftModalData}
          setShowModal={setShowNewShiftModal}
        />
        <ShiftTemplateModal
          showModal={showShiftTemplateModal}
          modalData={shiftTemplateModalData}
          setShowModal={setShowShiftTemplateModal}
        />
        <ScheduleTemplateModal
          modalState={scheduleTemplateModalState}
          setModalState={setScheduleTemplateModalState}
        />
        <CreateCoverRequestModal
          showModal={showCreateCoverModal}
          setShowModal={setShowCreateCoverModal}
        />
      </ModalContext.Provider>
    </PageDataContext.Provider>
  );
}
