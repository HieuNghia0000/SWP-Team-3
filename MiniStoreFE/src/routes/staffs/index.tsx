import Breadcrumbs from "~/components/Breadcrumbs";
import { AiOutlineSearch } from "solid-icons/ai";
import { IoEyeOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { FiLock, FiUnlock } from "solid-icons/fi";
import { createRouteData, useRouteData, useSearchParams } from "solid-start";
import Pagination from "~/components/Pagination";
import { A } from "@solidjs/router";
import { Accessor, Component, For, Setter, Show, createSignal } from "solid-js";
import routes from "~/utils/routes";
import { Staff, StaffStatus } from "~/types";
import PopupModal from "~/components/PopupModal";
import { FaSolidLock, FaSolidPencil, FaSolidUnlock } from "solid-icons/fa";
import { RiSystemAddFill } from "solid-icons/ri";

const mockData = [
  {
    staffId: 1,
    staffName: "Nguyen Van A",
    username: "nguyenvana",
    phoneNumber: "0123456789",
    role: "Manager",
    workDays: "TUE, THU, SAT, SUN",
    status: "ACTIVE",
    salary: { hourlyWage: 80.0 },
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
  {
    staffId: 2,
    staffName: "Nguyen Van B",
    username: "nguyenvanb",
    phoneNumber: "0123456789",
    role: "Manager",
    workDays: "TUE, THU, SAT, SUN",
    status: "DISABLED",
    salary: { hourlyWage: 80.0 },
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
  {
    staffId: 3,
    staffName: "Nguyen Van B",
    username: "nguyenvanb",
    phoneNumber: "0123456789",
    role: "Cashier",
    workDays: "TUE, THU, SAT",
    status: "DISABLED",
    salary: { hourlyWage: 60.0 },
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
  },
];

type ParamType = {
  perPage?: string;
  curPage?: string;
  search?: string;
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
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const data = useRouteData<typeof routeData>();
  const [showModal, setShowModal] = createSignal<boolean>(false);
  const [modalData, setModalData] = createSignal<Staff>();

  const totalItems = () => data()?.length ?? 0;

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
              class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
            >
              <span class="text-lg">
                <RiSystemAddFill />
              </span>
              <span>Add Staff</span>
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
                        href={routes.staff(item.staffId)}
                        class="hover:text-indigo-500"
                      >
                        {item.staffName}
                      </A>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      {item.phoneNumber}
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
                          "bg-green-500": item.status === StaffStatus.ACTIVATED,
                          "bg-red-500": item.status === StaffStatus.DISABLED,
                        }}
                      >
                        {item.status === StaffStatus.ACTIVATED
                          ? "Active"
                          : "Disabled"}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                      <div class="flex flex-row gap-1">
                        <div class="relative flex justify-center items-center">
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
                        <div class="relative flex justify-center items-center">
                          <A
                            href={routes.staffEdit(item.staffId)}
                            class="peer text-base text-gray-500 hover:text-indigo-500"
                          >
                            <OcPencil3 />
                          </A>
                          <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                            Edit
                          </span>
                        </div>
                        <div class="relative flex justify-center items-center">
                          <button class="peer text-base text-gray-500 hover:text-indigo-500">
                            <Show
                              when={item.status === StaffStatus.ACTIVATED}
                              fallback={<FiUnlock />}
                            >
                              <FiLock />
                            </Show>
                          </button>
                          <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                            {item.status === StaffStatus.ACTIVATED
                              ? "Disable"
                              : "Enable"}
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

        <Pagination totalItems={totalItems}/>
      </main>

      {/* <!-- Modal panel, show/hide based on modal state. --> */}
      <StaffDetailsModal
        showModal={showModal}
        modalData={modalData}
        setShowModal={setShowModal}
      />
    </>
  );
}

const StaffDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<Staff | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  return (
    <PopupModal.Wrapper
      title="Staff Details"
      close={() => setShowModal(false)}
      open={showModal}
    >
      <PopupModal.Body>
        <div class="text-lg mb-2.5 font-semibold text-center text-gray-800">
          <p>Nguyen Van A</p>
          <p class="text-sm text-gray-400">ID: 1</p>
        </div>
        <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Email:</span>
              <span>nguyenvana@gmail.com</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Username:</span>
              <span>nguyenvana</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Phone Number:</span>
              <span>0987654321</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Hourly Wage:</span>
              <span>0 ₫</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Role:</span>
              <span
                class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-red-700 rounded-full"
                classList={{
                  "bg-red-200": true,
                }}
              >
                Manager
              </span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Status:</span>
              <span
                class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold text-white rounded-full"
                classList={{
                  "bg-green-500": true,
                }}
              >
                {true ? "Activated" : "Disabled"}
              </span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Working days:</span>
              <span>TUE, THU, SAT, SUN</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Created At:</span>
              <span>Sep 1st 2021, 7:00 am</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Updated At:</span>
              <span>Sep 1st 2021, 7:00 am</span>
            </div>
          </div>
          {/* <div class="flex flex-row justify-end gap-3 pt-2">
          <button class="px-3.5 py-2 text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white">
            Disable
          </button>
        </div> */}
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="flex w-full items-center justify-start gap-3">
          <A
            href={routes.staffEdit(1)}
            class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
          >
            <span class="">
              <FaSolidPencil />
            </span>
            Edit Staff
          </A>
          <button class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2">
            <span class="">
              <Show
                when={modalData()?.status === StaffStatus.ACTIVATED}
                fallback={<FaSolidUnlock />}
              >
                <FaSolidLock />
              </Show>
            </span>
            {modalData()?.status === StaffStatus.ACTIVATED
              ? "Disable"
              : "Enable"}
          </button>
        </div>
      </PopupModal.Footer>
    </PopupModal.Wrapper>
  );
};
