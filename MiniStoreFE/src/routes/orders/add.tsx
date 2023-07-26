import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import { CgTrash } from "solid-icons/cg";
import { AiOutlineSearch } from "solid-icons/ai";
import { OcPaperairplane2 } from "solid-icons/oc";
import { FaSolidArrowRotateRight, FaSolidPlus } from "solid-icons/fa";
import { createRouteData, useSearchParams } from "solid-start";
import axios from "axios";
import { DataResponse, Product } from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import { createSignal, For } from "solid-js";
import { useRouteData } from "@solidjs/router";
import Pagination from "~/components/Pagination";
import formatNumberWithCommas from "~/utils/formatNumberWithCommas";
import moment from "moment";
import { useAuth } from "~/context/Auth";

type ParamType = {
  search?: string;
  amount_from?: string;
  amount_to?: string;
  perPage?: string;
  curPage?: string;
};

type PaymentDetails = {
  code: string;
  message: string;
  paymentUrl: string;
}

export function routeData() {
  const [ searchParams ] = useSearchParams<ParamType>();

  const products = createRouteData(
    async ([ key, perPage, curPage, search ]) => {
      try {
        const uri = new URLSearchParams({ perPage, curPage, search });

        const { data } = await axios.get<DataResponse<Product[]>>(
          `${getEndPoint()}/${key}?${uri.toString()}`
        );
        return data.content;
      } catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    {
      key: () => [ "products", searchParams.perPage ?? "10", searchParams.curPage ?? "1", searchParams.search ?? "" ],
      reconcileOptions: { key: "productId" }
    }
  );
  return { data: products };
}

export default function AddOrders() {
  const { data } = useRouteData<typeof routeData>();
  const { user } = useAuth();
  const [ , setSearchParams ] = useSearchParams<ParamType>();

  const [ selectedProducts, setSelectedProducts ] = createSignal<Product[]>([]);
  const [ totalPrice, setTotalPrice ] = createSignal<number>(0);

  const totalItems = () => data()?.length ?? 0;

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search });
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts().filter((_, i) => i !== index));

    const grandTotal = selectedProducts().reduce((total, product) => total + product.price * product.quantity, 0);
    setTotalPrice(grandTotal);
  };

  const handleAddProduct = (item: Product) => {
    const existingProduct = selectedProducts().find((p) => p.productId === item.productId);

    if (existingProduct) {
      const updatedProducts = selectedProducts().map((p) =>
        p.productId === item.productId ? { ...p, quantity: p.quantity + 1 } : p
      );
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([ ...selectedProducts(), { ...item, quantity: 1 } ]);
    }

    const grandTotal = selectedProducts().reduce((total, product) => total + product.price * product.quantity, 0);
    setTotalPrice(grandTotal);
  };

  const handlePayNow = async () => {
    try {
      // Create order
      const { data: orderData } = await axios.post<DataResponse<{ orderId: number }>>(
        `${getEndPoint()}/orders/add?returnData=false`, {
          grandTotal: `${totalPrice() + totalPrice() * 0.1}`,
          orderItems: selectedProducts().map((product) => ({
            productId: product.productId,
            quantity: product.quantity
          })),
          orderDate: moment().format("YYYY-MM-DD[T]HH:mm:ss"),
          staffId: user()?.staffId || 0
        }
      );
      if (!orderData) throw new Error("Invalid response from server");

      // Get VNPAY payment URL
      const { data } = await axios.post<DataResponse<PaymentDetails>>(
        `${getEndPoint()}/orders/payment`, {
          grandTotal: `${totalPrice() + totalPrice() * 0.1}`,
          orderId: orderData.content.orderId
        }
      );
      if (!data) throw new Error("Invalid response from server");

      // Redirect to VNPAY payment URL
      window.location.href = data.content.paymentUrl;
    } catch (e) {
      console.error(handleFetchError(e));
    }
  };

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Add Orders</h1>
      <Breadcrumbs linkList={[
        { name: "Orders", link: routes.orders },
        { name: "Add Orders" }
      ]}/>

      <div class="flex flex-row justify-between items-start gap-8">

        {/* Left table */}
        <div class="flex-1 bg-white p-5 border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
          {/*Order ID*/}
          <div class="bg-indigo-200 p-3 mb-2">
            <div class="flex justify-around text-indigo-500">
              <h2 class="text-xl font-medium">Date: {moment().format("MMMM Do YYYY")}</h2>
            </div>
          </div>

          {/*Product List*/}
          <div class="flex flex-col overflow-x-auto">
            <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
              {/*Table head*/}
              <thead>
              <tr>
                <th
                  class="px-2.5 py-[8.7px] pl-[18px] w-16 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">ID
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Product
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-32 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Price
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-16 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Quantity
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-32 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Subtotal
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-16 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Action
                </th>
              </tr>
              </thead>

              {/*Table row*/}
              <tbody>
              {selectedProducts().map((product, index) => {
                const subtotal = product.price * product.quantity;
                return (
                  <tr>
                    <td
                      class="px-2.5 pl-[18px] text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">#{product.productId}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b font-bold">{product.name}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">{formatNumberWithCommas(product.price)}&nbsp;₫
                    </td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">{`${product.quantity}`}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">{formatNumberWithCommas(subtotal)}&nbsp;₫
                    </td>
                    <td class="px-2.5 text-sm whitespace-nowrap leading-10 border-[#e2e7ee] border-b overflow-visible">
                      <div class="relative flex justify-center">
                        <button
                          class="peer text-gray-500 hover:text-indigo-500 text-xl"
                          onClick={() => handleRemoveProduct(index)}>
                          <CgTrash/>
                        </button>
                        <p
                          class="inline peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Remove
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {/*Grand total*/}
          <div class="bg-indigo-200 p-3 mt-4 flex flex-row justify-end">
            <div class="flex-1 text-indigo-500">
              <p class="text-lg text-indigo-600 font-medium">
                Total:
              </p>
              <p class="text-lg text-indigo-600 font-medium">
                Tax (10%):
              </p>
              <p class="text-lg text-indigo-600 font-medium">
                Grand Total:
              </p>
            </div>
            <div class="flex-1 text-indigo-500 text-end">
              <p class="text-lg text-indigo-600 font-medium">
                {formatNumberWithCommas(totalPrice())}&nbsp;₫
              </p>
              <p class="text-lg text-indigo-600 font-medium">
                {formatNumberWithCommas(totalPrice() * 0.1)}&nbsp;₫
              </p>
              <p class="text-lg text-indigo-600 font-medium">
                {formatNumberWithCommas(totalPrice() + totalPrice() * 0.1)}&nbsp;₫
              </p>
            </div>
          </div>

          {/*Interactive button*/}
          <div class="flex justify-between mt-4 py-4">
            <button
              type="button"
              class="flex items-center bg-red-500 px-12 py-2 text-white font-medium rounded-lg hover:bg-red-600"
              onClick={() => {
                setSelectedProducts([]);
                setTotalPrice(0);
              }}>
              <span class="text-lg mr-2"><FaSolidArrowRotateRight/></span>
              <span>Reset</span>
            </button>
            <button
              type="submit"
              class="flex items-center bg-green-700 px-12 py-2 text-white font-medium rounded-lg hover:bg-green-800"
              onclick={handlePayNow}>
              <span class="text-lg mr-2"><OcPaperairplane2/></span>
              <span>Pay now</span>
            </button>
          </div>
        </div>

        {/* Right table*/}
        <div class="flex-1 bg-white p-5 border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
          {/*Search product*/}
          <div class="mb-2">
            <form class="relative" onSubmit={onSearchSubmit}>
              <input
                type="text"
                class="w-full max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
                placeholder="Search the product by Name"
                name="search"
              />
              <button
                class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
                type="submit"
                title="Search">
                <AiOutlineSearch/>
              </button>
            </form>
          </div>

          {/*Product list*/}
          <div class="flex flex-col overflow-x-auto">
            <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
              {/*Table head*/}
              <thead>
              <tr>
                <th
                  class="px-2.5 py-[8.7px] pl-[18px] w-16 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">ID
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Product
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-44 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Barcode
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-32 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Price
                </th>
                <th
                  style={{ "border-left": "1px dashed #d5dce6" }}
                  class="px-2.5 py-[8.7px] w-16 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                  scope="col">Action
                </th>
              </tr>
              </thead>

              {/*Table row*/}
              <tbody>
              <For each={data()}>
                {(item) => (
                  <tr>
                    <td
                      class="px-2.5 pl-[18px] text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">#{item.productId}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b font-bold">{item.name}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">{item.barCode || ""}</td>
                    <td
                      class="px-2.5 text-sm whitespace-nowrap truncate leading-10 border-[#e2e7ee] border-b">{formatNumberWithCommas(item.price)}&nbsp;₫
                    </td>
                    <td class="px-2.5 text-sm whitespace-nowrap leading-10 border-[#e2e7ee] border-b overflow-visible">
                      <div class="relative flex justify-center">
                        <button
                          class="peer text-base text-gray-500 p-2 rounded transition-colors hover:bg-indigo-300 hover:text-indigo-500"
                          onClick={() => handleAddProduct(item)}>
                          <FaSolidPlus/>
                        </button>
                        <p
                          class="inline peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out mb-0.5">
                          Add
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
              </tbody>
            </table>

            <Pagination totalItems={totalItems}/>
          </div>
        </div>
      </div>
    </main>
  )
}