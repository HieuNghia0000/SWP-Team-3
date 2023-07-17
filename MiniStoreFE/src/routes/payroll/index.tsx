import { useSearchParams } from "@solidjs/router";
import { ParamType } from "~/components/payroll/types";
import { DataResponse, Staff } from "~/types";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { createRouteData, useRouteData } from "solid-start";
import { createSignal, Show } from "solid-js";
import { ModalContext } from "~/context/Payroll";
import Breadcrumbs from "~/components/Breadcrumbs";
import ToolBar from "~/components/payroll/Toolbar";
import Table from "~/components/payroll/Table";

export function routeData() {
  const [ params ] = useSearchParams<ParamType>();
  const timesheets = createRouteData(
    async ([ key, search, from, to ]) => {
      try {
        if (!from || !to) return;
        const uri = new URLSearchParams({ search, from, to });
        const { data } = await axios.get<DataResponse<Staff[]>>(
          `${getEndPoint()}/${key}?${uri.toString()}`
        );
        console.log(data.content)
        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [
        "timesheets/payroll",
        params.search ?? "",
        params.from ?? "",
        params.to ?? "",
      ],
      reconcileOptions: { key: "staffId" }
    }
  );
  return { data: timesheets };
}

export default function Payroll() {
  const { data } = useRouteData<typeof routeData>();
  const [ showModal, setShowModal ] = createSignal(false);
  const [ chosenId, setChosenId ] = createSignal(0);

  return (
    <main>
      <ModalContext.Provider value={{
        chosenId,
        setChosenId,
        showModal,
        setShowModal,
      }}>
        <h1 class="mb-2 text-2xl font-medium">Payroll</h1>
        <Breadcrumbs linkList={[ { name: "Payroll" } ]}/>

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

        {/*<EditTimesheetModal/>*/}
      </ModalContext.Provider>
    </main>
  );
}
