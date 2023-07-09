import Breadcrumbs from "~/components/Breadcrumbs";
import { useSearchParams, createRouteData } from "solid-start";
import { DataResponse, TimeClock } from "~/types";
import { AiOutlineSearch } from "solid-icons/ai";
import { Accessor, createEffect, createSignal, For } from "solid-js";
import { A, useRouteData } from "@solidjs/router";
import routes from "~/utils/routes";
import Pagination from "~/components/Pagination";

const mockData = [
  {
    staffId: 1,
    staffName: "Nguyen Van A",
    checkIn: "6:05 am",
    checkOut: "12:05 pm",
    totalTime: "6h10m",
    role: "Manager",
  },
  {
    staffId: 2,
    staffName: "Nguyen Van B",
    checkIn: "7:10 am",
    checkOut: "14:30 pm",
    totalTime: "8h10m",
    role: "Cashier",
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
        <DateRangePicker />

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

function DateRangePicker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = createSignal(
    searchParams.day ? parseInt(searchParams.day) : currentDate.getDate()
  );
  const [selectedMonth, setSelectedMonth] = createSignal(
    searchParams.month
      ? parseInt(searchParams.month)
      : currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = createSignal(
    searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear()
  );

  const daysInMonth = new Date(selectedYear(), selectedMonth(), 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const years = Array.from(
    { length: currentDate.getFullYear() - 1900 + 1 },
    (_, i) => currentDate.getFullYear() - i
  );

  const handleDayChange = (e: Event) => {
    const day = parseInt((e.target as HTMLSelectElement).value);
    setSelectedDay(day);
    setSearchParams({ ...searchParams, day: day.toString() });
  };

  const handleMonthChange = (e: Event) => {
    const month = parseInt((e.target as HTMLSelectElement).value);
    setSelectedMonth(month);
    setSearchParams({ ...searchParams, month: month.toString() });
  };

  const handleYearChange = (e: Event) => {
    const year = parseInt((e.target as HTMLSelectElement).value);
    setSelectedYear(year);
    setSearchParams({ ...searchParams, year: year.toString() });
  };

  createEffect(() => {
    if (!searchParams.day) {
      setSelectedDay(currentDate.getDate());
    }
    if (!searchParams.month) {
      setSelectedMonth(currentDate.getMonth() + 1);
    }
    if (!searchParams.year) {
      setSelectedYear(currentDate.getFullYear());
    }
  });

  return (
    <div class="flex justify-center items-center mt-4 mb-4">
      <div class="mr-4">
        <label class="block mb-1 text-sm font-medium text-gray-500">Day</label>
        <select
          class="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedDay()}
          onChange={handleDayChange}
        >
          {days.map((day) => (
            <option value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div class="mr-4">
        <label class="block mb-1 text-sm font-medium text-gray-500">
          Month
        </label>
        <select
          class="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedMonth()}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-500">Year</label>
        <select
          class="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedYear()}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
