import Breadcrumbs from "~/components/Breadcrumbs";
import { AiOutlineSearch } from "solid-icons/ai";
import { IoEyeOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { VsTrash } from "solid-icons/vs";

export default function Staff() {
  const prev = () => {
    console.log("prev");
  };

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Staff Management</h1>
      <Breadcrumbs linkList={[{ name: "Staff Management" }]} />

      {/* Search bar */}
      <form>
        <div class="flex justify-center">
          <div class="relative">
            <input
              type="text"
              class="w-96 max-w-full border-gray-300 rounded-full py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
              placeholder="Search staffs (type text, then press Enter)"
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
          </div>
        </div>
        <div class="flex items-center justify-center gap-4 mt-2">
          <div class="inline-flex gap-2">
            <input
              type="radio"
              id="cardname"
              value="cardname"
              name="searchBy"
              checked
            />
            <label for="cardname">Staff name</label>
          </div>
          <div class="inline-flex gap-2">
            <input type="radio" id="tagname" value="tagname" name="searchBy" />
            <label for="tagname">Staff role</label>
          </div>
        </div>
      </form>

      <div class="border my-4"></div>

      {/* Table */}
      <div>
        <div class="flex justify-between items-center flex-wrap">
          <p
            class="text-xl font-bold text-gray-800 mb-2 pr-4 truncate"
            title="Deck name"
          >
            0 cards found:
          </p>
        </div>
        <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
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
                  6:05 am
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  12:05pm
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  6 hours
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  Manager
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <div class="space-x-1">
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <IoEyeOutline />
                    </button>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <OcPencil3 />
                    </button>
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
                  6:05 am
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  12:05pm
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  6 hours
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  Manager
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <div class="space-x-1">
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <IoEyeOutline />
                    </button>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <OcPencil3 />
                    </button>
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
                  6:05 am
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  12:05pm
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  6 hours
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  Manager
                </td>
                <td class="px-6 py-4 whitespace-nowrap max-w-[150px] truncate md:hover:overflow-visible md:hover:whitespace-normal">
                  <div class="space-x-1">
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <IoEyeOutline />
                    </button>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <OcPencil3 />
                    </button>
                    <button class="text-base text-gray-500 hover:text-indigo-500">
                      <VsTrash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <!--Pagination--> */}
        <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to{" "}
                <span class="font-medium">10</span> of{" "}
                <span class="font-medium">100</span> results
              </p>
            </div>
            <div>
              <div>
                <nav
                  class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span class="sr-only">Previous</span>
                    <svg
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <template x-for="pageNumber in 5">
                    <a
                      href="#"
                      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      x-show="currentPage + pageNumber - 3 > 0 && currentPage + pageNumber - 3 <= lastPage"
                      x-bind:class="{ 'bg-indigo-600 text-white hover:bg-indigo-600 focus:outline-none focus:ring': currentPage === currentPage + pageNumber - 3, 'text-gray-900': currentPage !== currentPage + pageNumber - 3 }"
                    >
                      <span x-text="currentPage + pageNumber - 3"></span>
                    </a>
                  </template>
                  <a
                    href="#"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span class="sr-only">Next</span>
                    <svg
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
