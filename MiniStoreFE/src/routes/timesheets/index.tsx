import { createRouteAction, createRouteData, useRouteData } from "solid-start";
import { DataResponse, Timesheet } from "~/types";
import { createSignal, Show } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/leave-requests/types";
import { toastSuccess } from "~/utils/toast";
import ToolBar from "~/components/timesheet/ToolBar";
import { ModalContext } from "~/context/Timesheet";
import Table from "~/components/timesheet/Table";
import EditTimesheetModal from "~/components/timesheet/EditTimesheetModal";

const deleteTimesheet = async (id: number) => {
  try {
    const { data } = await axios.delete<DataResponse<Timesheet>>(`${getEndPoint()}/timesheets/delete/${id}`)
    if (!data) throw new Error("Invalid response from server");
    return true;
  } catch (error: any) {
    throw new Error(handleFetchError(error));
  }
}

export function routeData() {
  const [ params ] = useSearchParams<ParamType>();
  const timesheets = createRouteData(
    async ([ key, perPage, curPage, search, from, to ]) => {
      try {
        if (!from || !to) return;
        const uri = new URLSearchParams({ perPage, curPage, search, from, to });
        const { data } = await axios.get<DataResponse<Timesheet[]>>(
          `${getEndPoint()}/${key}?${uri.toString()}`
        );
        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [
        "timesheets/list",
        params.perPage ?? "10",
        params.curPage ?? "1",
        params.search ?? "",
        params.from ?? "",
        params.to ?? "",
      ],
      reconcileOptions: { key: "timesheetId" }
    }
  );
  return { data: timesheets };
}

export default function Timesheets() {
  const { data } = useRouteData<typeof routeData>();
  const [ showEditModal, setShowEditModal ] = createSignal(false);
  const [ chosenId, setChosenId ] = createSignal(0);
  const [ deleting, deleteAction ] = createRouteAction(deleteTimesheet);

  const totalItems = () => data.error ? 0 : data()?.length ?? 0;

  const onDelete = async (id: number) => {
    if (deleting.pending) return;
    if (!confirm("Are you sure you want to delete this timesheet?")) return;

    const success = await deleteAction(id);
    if (!success) return;

    if (showEditModal()) setShowEditModal(false);
    toastSuccess("Timesheet deleted successfully");
  }

  return (
    <main>
      <ModalContext.Provider value={{
        chosenId,
        setChosenId,
        showEditModal,
        setShowEditModal,
        onDelete
      }}>
        <h1 class="mb-2 text-2xl font-medium">Timesheets</h1>
        <Breadcrumbs linkList={[ { name: "Timesheets" } ]}/>

        {/* Search bar */}
        <ToolBar/>

        <Show when={data.loading}>
          <div class="mb-2">
            Loading...
          </div>
        </Show>

        <Show when={!data.error && data() !== undefined} fallback={<div>Something went wrong</div>}>
          <Table/>
        </Show>

        <Pagination totalItems={totalItems}/>

        <EditTimesheetModal/>
      </ModalContext.Provider>
    </main>
  );
}
