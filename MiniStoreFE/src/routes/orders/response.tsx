import { createRouteData, useLocation } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import { useRouteData } from "@solidjs/router";
import { DataResponse, Order } from "~/types";
import { Show } from "solid-js";
import handleFetchError from "~/utils/handleFetchError";

type PaymentResponse = {
  message: string;
  RspCode: string;
  order?: Order;
}

export function routeData() {
  const location = useLocation();

  const products = createRouteData(
    async ([ key, search ]) => {
      try {
        if (search === "") {
          throw new Error("Missing search params");
        }
        console.log(`${getEndPoint()}/${key}${search}`);
        const { data } = await axios.get<DataResponse<PaymentResponse>>(`${getEndPoint()}/${key}${search}`);
        // console.log(data.content);
        return data.content.order;

      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [ "orders/payment/response", location.search ],
    }
  );
  return { data: products };
}

export default function OrdersResponse() {
  // TODO: Use createResource instead of createRouteData. We want to have a toast notification in the client side
  // something like createResource(() => !isServer, () => {});
  // remember to check how many times the resource fetcher is called. It should be called only once
  const { data } = useRouteData<typeof routeData>();

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Order Details</h1>
      <Breadcrumbs
        linkList={[
          { name: "Orders", link: routes.orders },
          { name: "Response" },
        ]}
      />
      <div>
        <Show when={data.error}>
          <p>Something went wrong</p>
        </Show>
        <Show when={!data.error && data() !== undefined}>
          <p>Order ID: {data()!.orderId}</p>
          <p>Order Status: {data()!.orderDate}</p>
          <p>Order Date: {data()!.paymentStatus}</p>
          <p>Grand Total: {data()!.grandTotal}</p>
        </Show>
      </div>
    </main>
  );
}

