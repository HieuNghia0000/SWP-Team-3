import Breadcrumbs from "~/components/Breadcrumbs";
import { useSearchParams, createRouteData } from "solid-start";
import { DataResponse, TimeClock } from "~/types";
import { AiOutlineSearch } from "solid-icons/ai";
import { Accessor, createSignal, For } from "solid-js";
import { A, useRouteData } from "@solidjs/router";
import routes from "~/utils/routes";
import Pagination from "~/components/Pagination";
import ToolBar from "~/components/shift-planning/ToolBar";

const mockData = [
  {
    staffId: 1,
    staffName: "Nguyen Van A",
    checkIn: "6:05 am",
    checkOut: "12:05 pm",
    totalTime: "6h10m",
    role: "Manager",
    location: "Computer 1",
  },
  {
    staffId: 2,
    staffName: "Nguyen Van B",
    checkIn: "7:10 am",
    checkOut: "14:30 pm",
    totalTime: "8h10m",
    role: "Cashier",
    location: "Desktop",
  },
];

type ParamType = {
  search?: string;
  perPage?: string;
  curPage?: string;
  amount_from?: string;
  amount_to?: string;
};

export function routeData() {
  const [searchParams] = useSearchParams<ParamType>();

  return createRouteData(
    async ([perPage, curPage]) => {
      // const response =await fetch(`http://localhost:3000/time-clock.json`);
      // const data = (await response.json()) as DataResponse<TimeClock[]>;
      // return data.content;
      return mockData as TimeClock[];
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function TimeClocks() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const [datePicked, setDatePicked] = createSignal<string>();
  const data = useRouteData<typeof routeData>();
  const totalItems = () => data()?.length ?? 0;
  const perPage = () => Number.parseInt(searchParams.perPage || "10");
  const curPage = () => Number.parseInt(searchParams.curPage || "1");
  const lastPage = () => Math.ceil(totalItems() / perPage());

  const prev = () => {
    setSearchParams({ curPage: Math.max(1, curPage() - 1) });
  };

  const next = () => {
    setSearchParams({ curPage: Math.min(lastPage(), curPage() + 1) });
  };

  const setPage = (page: number) => {
    setSearchParams({ curPage: Math.max(1, Math.min(lastPage(), page)) });
  };

  const setPerPage = (page: number) => {
    setSearchParams({ perPage: Math.max(1, Math.min(100, page)) });
  };

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search });
  };

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Time Clock</h1>
      <Breadcrumbs linkList={[{ name: "Time Clock" }]} />

      {/* Toolbar */}
      <div>
        <div class="flex justify-center items-center">
          <form class="relative" onSubmit={onSearchSubmit}>
            <input
              type="text"
              class="w-96 max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
              placeholder="Search (type text, number, then press Enter)...."
              name="search"
              value=""
            />
            <button
              class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
              type="submit"
              title="Search"
            >
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {/* Date picked */}
        <div class="mt-4">
          <ToolBar datePicked={datePicked} setDatePicked={setDatePicked} />
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
                  Staff
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check in
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check out
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total time
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
                  Location
                </th>
              </tr>
            </thead>
            {/* Table row */}
            <tbody>
              <For each={data()}>
                {(item, index) => (
                  <tr class="hover:bg-gray-200 odd:bg-white even:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      <A
                        href={routes.staff(item.staffId)}
                        class="hover:text-indigo-500"
                      >
                        {item.staffName}
                      </A>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.checkIn}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.checkOut}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.totalTime}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.role}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.location}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={totalItems}
          perPage={perPage}
          curPage={curPage}
          lastPage={lastPage}
          prev={prev}
          next={next}
          setPage={setPage}
        />
      </div>
    </main>
  );
}
