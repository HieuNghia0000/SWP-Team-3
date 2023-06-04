import Breadcrumbs from "~/components/Breadcrumbs";
import { AiOutlineSearch } from "solid-icons/ai";
import { IoEyeOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { VsTrash } from "solid-icons/vs";
import { createRouteData, useRouteData, useSearchParams } from "solid-start";
import Pagination from "~/components/Pagination";
import { A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { CgClose } from "solid-icons/cg";

export function routeData() {
  const [searchParams] = useSearchParams();

  return createRouteData(
    async ([perPage, curPage]) => {
      // const response = await fetch(
      //   `https://hogwarts.deno.dev/students?perPage=${perPage}&curPage=${curPage}`
      // );
      // return await response.json();
      return true;
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function Staffs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useRouteData<typeof routeData>();
  const [showModal, setShowModal] = createSignal<boolean>(false);
  const [modalData, setModalData] = createSignal<number>();

  const totalItems = 100;
  const perPage = () => Number.parseInt(searchParams.perPage ?? 10);
  const curPage = () => Number.parseInt(searchParams.curPage ?? 1);
  const lastPage = () => Math.ceil(totalItems / perPage());

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

  const onViewDetails = (dataIndex: number) => {
    console.log(dataIndex);
    setShowModal(true);
    setModalData(dataIndex);
  };

  return (
    <>
      <main class="min-w-fit">
        <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
        <Breadcrumbs linkList={[{ name: "Staff Management" }]} />

        {/* Search bar */}
        <div class="mb-4 flex flex-row justify-between">
          <form class="relative" onSubmit={onSearchSubmit}>
            <input
              type="text"
              class="w-96 max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
              placeholder="Search (type text, then press Enter)"
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
          <div class="flex justify-center items-center mr-5">
            <label class="inline-block text-gray-600" for="email">
              Show
            </label>
            <div class="flex">
              <select
                onChange={(e) =>
                  setPerPage(Number.parseInt(e.currentTarget.value))
                }
                class="block w-full px-2 py-1 ml-2 rtl:mr-2 text-base font-normal bg-white border rounded-lg outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:text-gray-600 dark:border-gray-600"
              >
                <option value="10" selected>
                  10
                </option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <span class="text-gray-600 ml-1">entries</span>
          </div>
        </div>

        {/* Table */}
        <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
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
            <tbody class="bg-white divide-y divide-gray-200">
              <tr class="hover:bg-gray-200">
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  John Bushmill
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  0987654321
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  Manager
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  TUE, THU, SAT, SUN
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <span class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-bold text-white bg-green-500 rounded-full">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <div class="flex flex-row gap-1">
                    <button
                      class="text-base text-gray-500 hover:text-indigo-500"
                      onClick={[onViewDetails, 0]}
                    >
                      <IoEyeOutline />
                    </button>
                    <A
                      href="/staffs/1"
                      class="text-base text-gray-500 hover:text-indigo-500"
                    >
                      <OcPencil3 />
                    </A>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <VsTrash />
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="hover:bg-gray-200">
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  John Bushmill
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  0987654321
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  Manager
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  TUE, THU, SAT, SUN
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <span class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-bold text-white bg-red-500 rounded-full">
                    Disabled
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <div class="flex flex-row gap-1">
                    <button
                      class="text-base text-gray-500 hover:text-indigo-500"
                      onClick={[onViewDetails, 1]}
                    >
                      <IoEyeOutline />
                    </button>
                    <A
                      href="/staffs/1"
                      class="text-base text-gray-500 hover:text-indigo-500"
                    >
                      <OcPencil3 />
                    </A>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <VsTrash />
                    </button>
                  </div>
                </td>
              </tr>
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

      {/* <!-- Modal panel, show/hide based on modal state. --> */}
      <Show when={showModal()}>
        <div
          class="absolute inset-0 z-20 flex bg-black bg-opacity-50 sm:justify-end sm:p-5 overflow-hidden"
          aria-modal="true"
          onClick={(e) => {
            if (e.target.ariaModal) setShowModal(false);
          }}
        >
          <div class="flex flex-col text-gray-500 bg-white shadow-lg sm:rounded-lg h-full overflow-auto slide-in-right">
            <div class="p-6 flex justify-between flex-row items-center text-black">
              <h4 class="text-2xl font-medium">Staff details</h4>
              <button
                onClick={[setShowModal, false]}
                class="text-xl hover:text-indigo-700"
              >
                <CgClose />
              </button>
            </div>
            <div class="border"></div>
            <div class="p-6">
              <form>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Input Text{" "}
                  </label>
                  <input
                    type="text"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="Mark Jhon"
                    placeholder="Enter Name"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Email Input
                  </label>
                  <input
                    type="email"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="markjohn@gmail.com"
                    placeholder="Enter Email"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Url Input
                  </label>
                  <input
                    type="url"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="https://tailwindui.com"
                    placeholder="Enter Url"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Telephone Input
                  </label>
                  <input
                    type="tel"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="1-(555)-555-5555"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Number Input
                  </label>
                  <input
                    type="number"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="2356"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Password Input
                  </label>
                  <input
                    type="password"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="markjhon123"
                    placeholder="Enter Password"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Date Input
                  </label>
                  <input
                    type="date"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="2019-12-18"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Month Input
                  </label>
                  <input
                    type="month"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="2019-12"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Week Input
                  </label>
                  <input
                    type="week"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="2019-W46"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Time Input
                  </label>
                  <input
                    type="time"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="13:45"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Date and Time Input
                  </label>
                  <input
                    type="datetime-local"
                    class="w-full px-4 py-2 text-gray-500 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    value="2019-12-19T13:45:00"
                  />
                </div>
                <div class="mb-4">
                  <label class="inline-block mb-2 text-gray-500">
                    Example textarea
                  </label>
                  <textarea
                    class="w-full px-4 py-2 border rounded outline-none focus:border-blue-500 focus:shadow dark:bg-dark-card dark:border-gray-600"
                    rows="5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="inline-block px-6 py-2 text-white transition-all duration-500 ease-in-out bg-blue-500 border border-blue-500 rounded shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white"
                >
                  Submit
                </button>
                <button
                  type="submit"
                  class="inline-block px-6 py-2 text-white transition-all duration-500 ease-in-out bg-red-500 border border-red-500 rounded shadow-md hover:shadow-xl hover:bg-red-600 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
