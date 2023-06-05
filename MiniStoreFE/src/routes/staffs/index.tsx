import Breadcrumbs from "~/components/Breadcrumbs";
import { AiOutlineSearch } from "solid-icons/ai";
import { IoEyeOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { FiLock, FiUnlock } from "solid-icons/fi";
import { createRouteData, useRouteData, useSearchParams } from "solid-start";
import Pagination from "~/components/Pagination";
import { A } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { CgClose } from "solid-icons/cg";
import moment from "moment";
import routes from "~/utils/routes";

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

type Staff = {
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
      return mockData as Staff[];
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function Staffs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useRouteData<typeof routeData>();
  const [showModal, setShowModal] = createSignal<boolean>(false);
  const [modalData, setModalData] = createSignal<Staff>();

  const totalItems = () => data()?.length ?? 0;
  const perPage = () => Number.parseInt(searchParams.perPage ?? 10);
  const curPage = () => Number.parseInt(searchParams.curPage ?? 1);
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

  const onViewDetails = (dataIndex: number) => {
    setShowModal(true);
    setModalData(data()![dataIndex]);
  };

  return (
    <>
      <main class="min-w-fit">
        <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
        <Breadcrumbs linkList={[{ name: "Staff Management" }]} />

        {/* Search bar */}
        <div class="mb-4 flex flex-row justify-between">
          <div class="flex flex-row gap-5 items-center">
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
            <A
              href={routes.staffAdd}
              class="text-base text-indigo-600 font-medium hover:text-indigo-500 hover:underline hover:underline-offset-2"
            >
              Add new staff
            </A>
          </div>
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
                          <button
                            class="peer text-base text-gray-500 hover:text-indigo-500"
                            onClick={[onViewDetails, index()]}
                          >
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

      {/* <!-- Modal panel, show/hide based on modal state. --> */}
      <Show when={showModal()}>
        <div
          class="absolute inset-0 z-20 flex bg-black bg-opacity-50 overflow-x-auto sm:justify-end sm:p-5 sm:overflow-hidden"
          aria-modal="true"
          onClick={(e) => {
            if (e.target.ariaModal) setShowModal(false);
          }}
        >
          <div class="min-w-[440px] flex flex-col text-gray-500 bg-white shadow-lg sm:rounded-lg h-full overflow-auto slide-in-right border">
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
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Staff ID:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.id}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Name:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.name}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Username:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.username}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Phone number:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.phone}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Role:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.role}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Salary per hour:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.baseSalary} VND
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Working days:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.workDays}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Status:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {modalData()?.status === 1 ? "Active" : "Disabled"}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Created at:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {moment(modalData()?.createdAt!).format(
                    "MMM Do YYYY, h:mm a"
                  )}
                </span>
              </div>
              <div class="flex items-center mb-4">
                <label class="w-3/4 sm:w-2/4 pr-2 mb-0 md:mr-0 mr-6">
                  Updated at:
                </label>
                <span class="w-full px-4 py-2 font-bold">
                  {moment(modalData()?.updatedAt!).format(
                    "MMM Do YYYY, h:mm a"
                  )}
                </span>
              </div>
              <div class="flex flex-row justify-end gap-3">
                <button class="px-6 py-2 text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white">
                  Disable
                </button>
                <A
                  href={routes.staffEdit(modalData()?.id!)}
                  class="px-6 py-2 text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600 hover:text-white"
                >
                  Edit
                </A>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
