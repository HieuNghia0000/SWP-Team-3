import { A, useRouteData, useSearchParams } from "@solidjs/router";
import { FiCalendar } from "solid-icons/fi";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { createRouteData } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import routes from "~/utils/routes";
import flatpickr from "flatpickr";
import { RiSystemCloseLine } from "solid-icons/ri";
import { BiRegularDollar } from "solid-icons/bi";
import DropDownBtn from "~/components/DropDownBtn";
import { Instance } from "flatpickr/dist/types/instance";
import { isServer } from "solid-js/web";
import moment from "moment";
import axios from "axios";
import {DataResponse, Order} from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";

type ParamType = {
  perPage?: string;
  curPage?: string;
  from?: string;
  to?: string;
  ago?: string;
  amount_from?: string;
  amount_to?: string;
};

export function routeData() {
  const [params] = useSearchParams<ParamType>();

  const orders = createRouteData(
      async ([perPage, curPage, amount_from, amount_to]) => {
          try {
              const {data} = await axios.get<DataResponse<Order[]>>(
                `${getEndPoint()}/orders?perPage=${perPage}&curPage=${curPage}&amount_from=${amount_from}&amount_to=${amount_to}`
              );
              return data.content;
          }
          catch (e) {
            throw new Error(handleFetchError(e));
          }
      },
      {key: () => [params.perPage ?? 10, params.curPage ?? 1, params.amount_from ?? "", params.amount_to ?? ""]}
  );

  return {data: orders};
}

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();

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

  const {data} = useRouteData<typeof routeData>();
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;
  const [dateStr, setDateStr] = createSignal<string>("");
  const [amountFrom, setAmountFrom] = createSignal<number>(
    Number.parseInt(searchParams.amount_from || "0")
  );
  const [amountTo, setAmountTo] = createSignal<number>(
    Number.parseInt(searchParams.amount_to || "0")
  );

  const totalItems = () => data()?.length ?? 0;

  onMount(() => {
    // @ts-ignore
    fp = flatpickr(dateRef!, {
      mode: "range",
      dateFormat: "Y-m-d",
      defaultDate: [searchParams.from, searchParams.to],
      onChange: updateDateStr,
      onReady: updateDateStr,
    });
  });

  onCleanup(() => {
    fp?.destroy();
  });

  const updateDateStr = (
    selectedDates: Date[],
    dateStr: string,
    instance: Instance
  ) => {
    if (selectedDates.length === 0) {
      setSearchParams({ from: undefined, to: undefined });
      setDateStr("");
    }
    if (selectedDates.length === 2) {
      const start = instance.formatDate(selectedDates[0], "Y-m-d");
      const end = instance.formatDate(selectedDates[1], "Y-m-d");
      setSearchParams({
        from: start,
        to: end,
        ago: undefined,
      });

      const start2 = instance.formatDate(selectedDates[0], "F j");
      const end2 = instance.formatDate(selectedDates[1], "F j, Y");
      if (end2.startsWith(start2)) setDateStr(end2);
      else setDateStr(`${start2} - ${end2}`);
    }
  };

  const setGroupBtn = (ago: string | undefined) => {
    setSearchParams({ ago });
    fp?.clear();
  };

  const displayDate = (dateStr: string) => {
    let date = moment(dateStr);
    // Check if the date is less than 24 hours ago
    if (moment().diff(date, "hours") < 24) {
      // Display relative time (e.g., "2 hours ago")
      let relativeTime = date.fromNow();
      return relativeTime;
    } else {
      // Display full date string
      let fullDate = date.format("D MMM YYYY");
      return fullDate;
    }
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Orders</h1>
      <Breadcrumbs linkList={[{ name: "Orders" }]} />

      {/* Search bar */}
      <div class="mb-4 flex flex-row justify-between">
        <div class="flex flex-row gap-5 items-center">
          <div class="flex flex-row gap-1 bg-white border-gray-200 border rounded-lg p-1">
            <DateRangeButton text="All time" setParam={setGroupBtn} />
            <DateRangeButton
              text="12 months"
              param="12months"
              setParam={setGroupBtn}
            />
            <DateRangeButton
              text="30 days"
              param="30days"
              setParam={setGroupBtn}
            />
            <DateRangeButton
              text="7 days"
              param="7days"
              setParam={setGroupBtn}
            />
            <DateRangeButton
              text="24 hours"
              param="24hours"
              setParam={setGroupBtn}
            />
          </div>
          <A
            href={routes.orderAdd}
            class="text-sm font-semibold text-white bg-indigo-600 py-2 px-3.5 rounded-lg hover:bg-indigo-700"
          >
            + Add Order
          </A>
        </div>
        <div class="flex justify-center items-center mr-5 gap-4">
          <div class="flex justify-center items-center gap-2">
            <Show when={dateStr()}>
              <button
                class="text-base hover:text-indigo-700"
                onClick={() => {
                  setDateStr("");
                  setSearchParams({
                    from: undefined,
                    to: undefined,
                  });
                  fp?.clear();
                }}
              >
                <RiSystemCloseLine />
              </button>
            </Show>
            <button
              ref={dateRef}
              type="button"
              class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
            >
              <FiCalendar />
              {dateStr() || "Select Dates"}
            </button>
          </div>
          <DropDownBtn text="Amount" icon={<BiRegularDollar />}>
            <div class="flex flex-col gap-2 justify-center items-center p-3 text-sm">
              <div class="w-full">
                <label for="amount_from" class="block">
                  From: {amountFrom()} ₫
                </label>
                <input
                  type="range"
                  step={1000}
                  min={0}
                  max={1000000}
                  id="amount_from"
                  name="amount_from"
                  value={searchParams.amount_from ?? "0"}
                  onInput={(e) => {
                    const value = Number.parseInt(e.currentTarget.value);
                    setAmountFrom(value);
                    if (amountTo() < value) setAmountTo(value);
                  }}
                  class="w-full"
                />
              </div>
              <div class="w-full">
                <label for="amount_to" class="block">
                  To: {amountTo() < amountFrom() ? amountFrom() : amountTo()} ₫
                </label>
                <input
                  type="range"
                  step={1000}
                  min={amountFrom()}
                  max={2000000}
                  id="amount_to"
                  name="amount_to"
                  value={searchParams.amount_to ?? "0"}
                  onInput={(e) => {
                    const value = Number.parseInt(e.currentTarget.value);
                    if (amountTo() < amountFrom()) setAmountTo(amountFrom());
                    else setAmountTo(value);
                  }}
                  class="w-full"
                />
              </div>
              <div class="w-full flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => {
                    setAmountFrom(0);
                    setAmountTo(0);
                    setSearchParams({
                      amount_from: undefined,
                      amount_to: undefined,
                    });
                  }}
                  class="inline-block px-3 py-1 text-gray-600 text-center hover:text-black"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams({
                      amount_from: amountFrom(),
                      amount_to: amountTo(),
                    });
                  }}
                  class="inline-block px-3 py-1 font-medium text-center text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </DropDownBtn>
        </div>
      </div>

      {/* Table */}
      <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 w-32 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          {/* <!-- Table row --> */}
          <tbody class="">
            <Show when={!data.error && data() != undefined}>
              <For each={data()}>
                {(item, index) => (
                    <tr class="hover:bg-gray-200 odd:bg-white even:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        <A
                            href={routes.order(item.orderId)}
                            class="hover:text-indigo-500"
                        >
                          {item.orderId}
                        </A>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.orderItems.map((item) => (item.product.name)).join(", ")}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {displayDate(item.orderDate)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.grandTotal}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        <div class="flex flex-row gap-1">
                          <div class="relative flex justify-center items-center">
                            <A
                                href={routes.order(item.orderId)}
                                class="peer text-base text-gray-500 hover:text-indigo-500"
                            >
                              <IoEyeOutline />
                            </A>
                            <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Details
                        </span>
                          </div>
                          <div class="relative flex justify-center items-center">
                            <A
                                href={routes.order(item.orderId)}
                                class="peer text-base text-gray-500 hover:text-indigo-500"
                            >
                              <IoTrashOutline />
                            </A>
                            <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Delete
                        </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      <Pagination totalItems={totalItems}/>
    </main>
  );
}

function DateRangeButton(props: {
  text: string;
  param?: string;
  setParam: (ago: string | undefined) => void;
}) {
  const { text, param, setParam } = props;
  const [searchParams] = useSearchParams<ParamType>();

  return (
    <button
      class="py-1 px-3 font-semibold rounded-md text-sm"
      classList={{
        "bg-indigo-100 text-indigo-700": searchParams.ago === param,
        "text-gray-500 hover:bg-indigo-50":
          !searchParams.ago || searchParams.ago !== param,
      }}
      onClick={() => setParam(param)}
    >
      {text}
    </button>
  );
}
