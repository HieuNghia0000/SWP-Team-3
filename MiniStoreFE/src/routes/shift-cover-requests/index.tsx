import { createRouteAction, createRouteData, useRouteData } from "solid-start";
import { DataResponse, LeaveRequest, ShiftCoverRequest } from "~/types";
import { createSignal, Show } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import ToolBar from "~/components/cover-requests/Toolbar";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/cover-requests/types";
import Table from "~/components/cover-requests/Table";
import CreateCoverRequestModal from "~/components/cover-requests/CreateCoverRequestModal";
import EditLeaveRequestModal from "~/components/cover-requests/EditLeaveRequestModal";
import { ModalContext } from "~/context/CoverRequest";
import { toastSuccess } from "~/utils/toast";

const deleteCoverRequest = async (id: number) => {
  try {
    const { data } = await axios.delete<DataResponse<LeaveRequest>>(`${getEndPoint()}/shift-cover-requests/delete/${id}`)
    if (!data) throw new Error("Invalid response from server");
    return true;
  } catch (error: any) {
    throw new Error(handleFetchError(error));
  }
}

export function routeData() {
  const [ params ] = useSearchParams<ParamType>();
  const leaveRequests = createRouteData(
    async ([ key, perPage, curPage, search ]) => {
      try {
        const { data } = await axios.get<DataResponse<ShiftCoverRequest[]>>(
          `${getEndPoint()}/${key}?perPage=${perPage}&curPage=${curPage}&search=${search}`
        );
        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [ "shift-cover-requests", params.perPage ?? 10, params.curPage ?? 1, params.search ?? "" ],
      reconcileOptions: { key: "shiftCoverRequestId" }
    }
  );
  return { data: leaveRequests };
}

export default function ShiftCoverRequests() {
  const { data } = useRouteData<typeof routeData>();
  const [ showCreateModal, setShowCreateModal ] = createSignal(false);
  const [ showEditModal, setShowEditModal ] = createSignal(false);
  const [ chosenRequestId, setChosenRequestId ] = createSignal(0);
  const [ deleting, deleteAction ] = createRouteAction(deleteCoverRequest);

  const totalItems = () => data.error ? 0 : data()?.length ?? 0;

  const onDelete = async (id: number) => {
    if (deleting.pending) return;
    if (!confirm("Are you sure you want to delete this shift cover request?")) return;

    const success = await deleteAction(id);
    if (!success) return;

    if (showEditModal()) setShowEditModal(false);
    toastSuccess("Shift cover request deleted successfully");
  }

  return (
    <main>
      <ModalContext.Provider value={{
        chosenRequestId,
        setChosenRequestId,
        showEditModal,
        setShowEditModal,
        onDelete
      }}>
        <h1 class="mb-2 text-2xl font-medium">Shift Cover Requests</h1>
        <Breadcrumbs linkList={[ { name: "Shift Cover Requests" } ]}/>

        {/* Search bar */}
        <ToolBar setShowCreateModal={setShowCreateModal}/>

        <Show when={data.loading}>
          <div class="mb-2">
            Loading...
          </div>
        </Show>

        <Table/>

        <Pagination totalItems={totalItems}/>

        <CreateCoverRequestModal showModal={showCreateModal} setShowModal={setShowCreateModal}/>

        {/*<EditLeaveRequestModal showModal={showEditModal} setShowModal={setShowEditModal}/>*/}
      </ModalContext.Provider>
    </main>
  );
}
