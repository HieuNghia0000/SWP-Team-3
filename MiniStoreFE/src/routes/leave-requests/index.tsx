import { createRouteData, useRouteData } from "solid-start";
import { DataResponse, LeaveRequest } from "~/types";
import { createSignal, Show } from "solid-js";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import ToolBar from "~/components/leave-requests/Toolbar";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/leave-requests/types";
import Table from "~/components/leave-requests/Table";
import CreateLeaveRequestModal from "~/components/leave-requests/CreateLeaveRequestModal";

export function routeData() {
  const [ params ] = useSearchParams<ParamType>();

  const leaveRequests = createRouteData(
    async ([ key, perPage, curPage, search ]) => {
      try {
        const { data } = await axios.get<DataResponse<LeaveRequest[]>>(
          `${getEndPoint()}/${key}?perPage=${perPage}&curPage=${curPage}&search=${search}`
        );
        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    { key: () => [ "leave-requests/list", params.perPage ?? 10, params.curPage ?? 1, params.search ?? "" ] }
  );

  return { data: leaveRequests };
}

export default function LeaveRequests() {
  const { data } = useRouteData<typeof routeData>();
  const [ showCreateModal, setShowCreateModal ] = createSignal(false);

  const totalItems = () => data.error ? 0 : data()?.length ?? 0;

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Leave Requests</h1>
      <Breadcrumbs linkList={[ { name: "Leave Requests" } ]}/>

      {/* Search bar */}
      <ToolBar setShowCreateModal={setShowCreateModal}/>

      <Show when={data.loading}>
        <div class="mb-2">
          Loading...
        </div>
      </Show>

      <Table/>

      <Pagination totalItems={totalItems}/>

      <CreateLeaveRequestModal showModal={showCreateModal} setShowModal={setShowCreateModal}/>
    </main>
  );
}
