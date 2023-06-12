import { A, useRouteData, useSearchParams } from "@solidjs/router";
import { FiCalendar, FiLock, FiUnlock } from "solid-icons/fi";
import { IoEyeOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { createRouteData } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import routes from "~/utils/routes";
import flatpickr from "flatpickr";
import { RiSystemCloseLine } from "solid-icons/ri";
import { BiRegularDollar } from "solid-icons/bi";
import clickOutside from "~/hooks/clickOutside";

0 && clickOutside;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      clickOutside: () => void;
    }
  }
}

const mockData = [
  {
    id: 1,
    name: "Nguyen Van A",
    username: "nguyenvana",
    phone: "0123456789",
    role: "Manager",
    workDays: "TUE, THU, SAT, SUN",
    status: 1,
    baseSalary: "80.000",
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Nguyen Van B",
    username: "nguyenvanb",
    phone: "0123456789",
    role: "Manager",
    workDays: "TUE, THU, SAT, SUN",
    status: 2,
    baseSalary: "80.000",
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Nguyen Van B",
    username: "nguyenvanb",
    phone: "0123456789",
    role: "Cashier",
    workDays: "TUE, THU, SAT",
    status: 2,
    baseSalary: "60.000",
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
];

type Order = {
  id: number;
  name: string;
  username: string;
  phone: string;
  role: string;
  workDays: string;
  status: number;
  baseSalary: string;
  createdAt: string;
  updatedAt: string;
};

export function routeData() {
  const [searchParams] = useSearchParams();

  return createRouteData(
    async ([perPage, curPage]) => {
      // const response = await fetch(
      //   `https://hogwarts.deno.dev/students?perPage=${perPage}&curPage=${curPage}`
      // );
      // return await response.json();
      return mockData as Order[];
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}
export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useRouteData<typeof routeData>();
  let dateRef: HTMLInputElement | undefined = undefined;
  let fp: flatpickr.Instance | undefined = undefined;
  const [dateStr, setDateStr] = createSignal<string>("");
  const [filterDropdown, setFilterDropdown] = createSignal(false);

  const totalItems = () => data()?.length ?? 0;
  const perPage = () => Number.parseInt(searchParams.perPage ?? 10);
  const curPage = () => Number.parseInt(searchParams.curPage ?? 1);
  const lastPage = () => Math.ceil(totalItems() / perPage());

  onMount(() => {
    fp = flatpickr(dateRef!, {
      mode: "range",
      dateFormat: "d-m-Y",
      onClose: (selectedDates, dateStr, instance) => {
        if (selectedDates.length === 0) {
          setSearchParams({ ago: undefined, from: undefined, to: undefined });
        }
        if (selectedDates.length === 2) {
          const start = instance.formatDate(selectedDates[0], "Y-m-d");
          const end = instance.formatDate(selectedDates[1], "Y-m-d");
          if (start && end) {
            setSearchParams({
              from: start,
              to: end,
              ago: undefined,
            });
          }
          setDateStr(dateStr);
        }
      },
      onChange: (selectedDates, dateStr) => {
        if (selectedDates.length === 0) {
          setDateStr("");
        }
        if (selectedDates.length === 2) {
          setDateStr(dateStr);
        }
      },
    });
  });

  onCleanup(() => {
    fp?.destroy();
  });

  const prev = () => {
    setSearchParams({ curPage: Math.max(1, curPage() - 1) });
  };

  const next = () => {
    setSearchParams({ curPage: Math.min(lastPage(), curPage() + 1) });
  };

  const setPage = (page: number) => {
    setSearchParams({ curPage: Math.max(1, Math.min(lastPage(), page)) });
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Orders</h1>
      <Breadcrumbs linkList={[{ name: "Orders" }]} />

      {/* Search bar */}
      <div class="mb-4 flex flex-row justify-between">
        <div class="flex flex-row gap-5 items-center">
          <div class="flex flex-row gap-1 bg-white border-gray-200 border rounded-lg p-1">
            <DateRangeButton
              active={() => searchParams.ago === undefined}
              text="All time"
              cb={() => fp?.clear()}
            />
            <DateRangeButton
              active={() => searchParams.ago === "12months"}
              text="12 months"
              param="12months"
              cb={() => fp?.clear()}
            />
            <DateRangeButton
              active={() => searchParams.ago === "30days"}
              text="30 days"
              param="30days"
              cb={() => fp?.clear()}
            />
            <DateRangeButton
              active={() => searchParams.ago === "7days"}
              text="7 days"
              param="7days"
              cb={() => fp?.clear()}
            />
            <DateRangeButton
              active={() => searchParams.ago === "24hours"}
              text="24 hours"
              param="24hours"
              cb={() => fp?.clear()}
            />
          </div>
          <A
            href={routes.orderAdd}
            class="text-sm font-semibold text-white bg-indigo-600 py-2.5 px-3.5 rounded-lg hover:bg-indigo-700"
          >
            + Add Order
          </A>
        </div>
        <div class="flex justify-center items-center mr-5 gap-4">
          <Show when={dateStr()}>
            <div class="flex justify-center items-center gap-2">
              <button
                class="text-base hover:text-indigo-700"
                onClick={() => {
                  setSearchParams({
                    ago: undefined,
                    from: undefined,
                    to: undefined,
                  });
                  fp?.clear();
                }}
              >
                <RiSystemCloseLine />
              </button>
              <label class="text-gray-500 font-medium">{dateStr()}</label>
            </div>
          </Show>
          <button
            ref={dateRef}
            type="button"
            class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
          >
            <FiCalendar />
            Select Dates
          </button>
          <div class="relative">
            <button
              type="button"
              onClick={() => setFilterDropdown(!filterDropdown())}
              class="range_flatpicker flex flex-row gap-2 justify-center items-center border border-gray-300 rounded-lg py-2 px-3.5 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
            >
              <BiRegularDollar />
              Amount
            </button>
            <Show when={filterDropdown()}>
              <div
                class="origin-top-right absolute right-0 top-11 z-30 w-48 rounded-lg shadow-lg border border-gray-200"
                use:clickOutside={() => setFilterDropdown(!filterDropdown())}
              >
                <div class="py-1 rounded-md bg-white shadow-xs">
                  <A
                    href={routes.logout}
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </A>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Table */}
      <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone number
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Work days
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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
            <For each={data()}>
              {(item, index) => (
                <tr class="hover:bg-gray-200 odd:bg-white even:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <A
                      href={routes.staff(item.id)}
                      class="hover:text-indigo-500"
                    >
                      {item.name}
                    </A>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.phone}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.role}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.workDays}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <span
                      class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-bold text-white rounded-full"
                      classList={{
                        "bg-green-500": item.status === 1,
                        "bg-red-500": item.status === 2,
                      }}
                    >
                      {item.status === 1 ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <div class="flex flex-row gap-1">
                      <div class="relative">
                        <button class="peer text-base text-gray-500 hover:text-indigo-500">
                          <IoEyeOutline />
                        </button>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Quick view
                        </span>
                      </div>
                      <div class="relative">
                        <A
                          href={routes.staffEdit(item.id)}
                          class="peer text-base text-gray-500 hover:text-indigo-500"
                        >
                          <OcPencil3 />
                        </A>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Edit
                        </span>
                      </div>
                      <div class="relative">
                        <button class="peer text-base text-gray-500 hover:text-indigo-500">
                          <Show
                            when={item.status === 1}
                            fallback={<FiUnlock />}
                          >
                            <FiLock />
                          </Show>
                        </button>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          {item.status === 1 ? "Disable" : "Enable"}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Pagination
        curPage={curPage}
        perPage={perPage}
        lastPage={lastPage}
        next={next}
        prev={prev}
        setPage={setPage}
        totalItems={totalItems}
      />
    </main>
  );
}

function DateRangeButton(props: {
  active: () => boolean;
  text: string;
  param?: string;
  cb: () => void;
}) {
  const { active, text, param, cb } = props;
  const [, setSearchParams] = useSearchParams();

  return (
    <button
      class="py-1.5 px-3 font-semibold rounded-md text-sm"
      classList={{
        "bg-indigo-100 text-indigo-700": active(),
        "text-gray-500 hover:bg-indigo-50": !active(),
      }}
      onClick={() => {
        setSearchParams({ ago: param, from: undefined, to: undefined });
        cb();
      }}
    >
      {text}
    </button>
  );
}
