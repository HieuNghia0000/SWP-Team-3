import { A, createRouteData, useRouteData } from "solid-start";
import { useSearchParams } from "@solidjs/router";
import { DataResponse, Product } from "~/types";
import { For } from "solid-js";
import routes from "~/utils/routes";
import Breadcrumbs from "~/components/Breadcrumbs";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import Pagination from "~/components/Pagination";
import { ParamType } from "~/components/leave-requests/types";
import ToolBar from "~/components/leave-requests/Toolbar";

export function routeData() {
  const [ searchParams ] = useSearchParams<ParamType>();

  return createRouteData(
    async ([ perPage, curPage ]) => {
      const response = await fetch(`http://localhost:3000/products.json`);
      const data = (await response.json()) as DataResponse<Product[]>;
      return data.content;
    },
    { key: () => [ searchParams.perPage ?? 10, searchParams.curPage ?? 1 ] }
  );
}

export default function LeaveRequests() {
  const data = useRouteData<typeof routeData>();

  const totalItems = () => data()?.length ?? 0;

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Leave Requests</h1>
      <Breadcrumbs linkList={[ { name: "Leave Requests" } ]}/>

      {/* Search bar */}
      <ToolBar/>

      {/* Table */}
      <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <table class="min-w-full table-fixed">
          <thead class="bg-[#f8fafc] text-left">
          <tr>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] pl-[18px] w-56 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            >
              Staff Member
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              Leave Type
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              Start Date
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              End Date
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              Status
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              Note
            </th>
            <th
              scope="col"
              class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
              style={{
                "border-left": "1px dashed #d5dce6",
              }}
            >
              Actions
            </th>
          </tr>
          </thead>
          {/* <!-- Table row --> */}
          <tbody class="">
          <For each={data()}>
            {(item) => (
              <tr class="hover:bg-[#ceefff] odd:bg-white even:bg-gray-50 text-[#333c48]">
                <td
                  class="px-2.5 pl-[18px] text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  <A
                    href={routes.product(item.productId)}
                    class="hover:text-indigo-500"
                  >
                    {item.productId}
                  </A>
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  {item.barcode}
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  {item.name}
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  {item.category?.name || "N/A"}
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    <span
                      class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-bold rounded-full"
                      classList={{
                        "text-orange-400 bg-orange-100": true,
                      }}
                    >
                        Pending
                    </span>
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  {item.price} ₫
                </td>
                <td
                  style={{
                    "border-left": "1px dashed #d5dce6",
                  }}
                  class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                  <div class="flex flex-row gap-1">
                    <div class="relative flex justify-center items-center">
                      <A
                        href={routes.product(item.productId)}
                        class="peer text-base text-gray-500 hover:text-indigo-500"
                      >
                        <IoEyeOutline/>
                      </A>
                      <span
                        class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Details
                        </span>
                    </div>
                    <div class="relative flex justify-center items-center">
                      <A
                        href={routes.productEdit(item.productId)}
                        class="peer text-base text-gray-500 hover:text-indigo-500"
                      >
                        <OcPencil3/>
                      </A>
                      <span
                        class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Edit
                        </span>
                    </div>
                    <div class="relative flex justify-center items-center">
                      <A
                        href={"/"}
                        class="peer text-base text-gray-500 hover:text-indigo-500"
                      >
                        <IoTrashOutline/>
                      </A>
                      <span
                        class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Delete
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
  );
}
