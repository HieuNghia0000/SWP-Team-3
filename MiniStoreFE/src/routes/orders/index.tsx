import { useRouteData, useSearchParams } from "@solidjs/router";
import { createRouteAction, createRouteData } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import { isServer } from "solid-js/web";
import moment from "moment";
import axios from "axios";
import { DataResponse, Order } from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { ParamType } from "~/components/order/types";
import ToolBar from "~/components/order/ToolBar";
import Table from "~/components/order/Table";
import { ModalContext } from "~/context/Order";
import { toastSuccess } from "~/utils/toast";
import { createSignal } from "solid-js";

const deleteOrder = async (id: number) => {
  try {
    const { data } = await axios.delete<DataResponse<Order>>(
      `${getEndPoint()}/orders/delete/${id}`
    );
    if (!data) throw new Error("Invalid response from server");
    return true;
  } catch (error: any) {
    throw new Error(handleFetchError(error));
  }
};

export function routeData() {
  const [ params ] = useSearchParams<ParamType>();

  const orders = createRouteData(
    async ([ key, perPage, curPage, amount_from, amount_to, ago, from, to ]) => {
      try {
        const uri = new URLSearchParams({ perPage, curPage, amount_from, amount_to, ago, from, to });

        const { data } = await axios.get<DataResponse<Order[]>>(
          `${getEndPoint()}/${key}?${uri.toString()}`
        );

        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [
        "orders",
        params.perPage ?? "10",
        params.curPage ?? "1",
        params.amount_from ?? "",
        params.amount_to ?? "",
        params.ago ?? "",
        params.from ?? "",
        params.to ?? ""
      ]
    }
  );

  return { data: orders };
}

export default function Orders() {
  const [ searchParams, setSearchParams ] = useSearchParams<ParamType>();

  if (isServer && (searchParams.from || searchParams.to)) {
    const from = moment(searchParams.from);
    const to = moment(searchParams.to);

    // check for the 'from' and 'to' params to be valid dates
    if (!from.isValid() || !to.isValid()) {
      setSearchParams({ from: undefined, to: undefined });
    }

    // check for the 'from' param to always be less than the 'to' param
    if (from.isAfter(to)) {
      setSearchParams({
        from: to.format("YYYY-MM-DD"),
        to: from.format("YYYY-MM-DD"),
      });
    }
  }

  const { data } = useRouteData<typeof routeData>();
  const [ showDetailsModal, setShowDetailsModal ] = createSignal(false);
  const [ showEditModal, setShowEditModal ] = createSignal(false);
  const [ chosenId, setChosenId ] = createSignal(0);
  const [ deleting, deleteAction ] = createRouteAction(deleteOrder);
  const totalItems = () => data()?.length ?? 0;

  const onDelete = async (id: number) => {
    if (deleting.pending) return;
    if (!confirm("Are you sure you want to delete this product?"))
      return;

    const success = await deleteAction(id);
    if (!success) return;

    if (showEditModal()) setShowEditModal(false);
    toastSuccess("Product was deleted successfully");
  };

  return (
    <main class="min-w-fit">
      <ModalContext.Provider value={{
        setShowDetailsModal,
        chosenId,
        setChosenId,
        onDelete
      }}>
        <h1 class="mb-2 text-2xl font-medium">Orders</h1>
        <Breadcrumbs linkList={[ { name: "Orders" } ]}/>

        <ToolBar/>

        <Table/>

        <Pagination totalItems={totalItems}/>
      </ModalContext.Provider>
    </main>
  );
}

