import { AiOutlineSearch } from "solid-icons/ai";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { RiSystemAddFill } from "solid-icons/ri";
import { For } from "solid-js";
import { A, createRouteData, useRouteData, useSearchParams } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import Pagination from "~/components/Pagination";
import { Category, DataResponse, Product } from "~/types";
import routes from "~/utils/routes";

type ParamType = {
  search?: string;
  perPage?: string;
  curPage?: string;
};

export function routeData() {
  const [searchParams] = useSearchParams<ParamType>();

  return createRouteData(
    async ([perPage, curPage]) => {
      const response = await fetch(`http://localhost:3000/products.json`);
      const data = (await response.json()) as DataResponse<Category[]>;
      return data.content;
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
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

  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search });
  };

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Categories</h1>
      <Breadcrumbs linkList={[{ name: "Categories" }]} />

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
        </div>
        <div class="flex justify-center items-center mr-5">
          <A
            href={routes.productAdd}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <RiSystemAddFill />
            </span>
            <span>Add Category</span>
          </A>
        </div>
      </div>

      {/* Table */}
      <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 w-1/3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sales
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
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
                      href={routes.category(item.categoryId)}
                      class="hover:text-indigo-500"
                    >
                      {item.name}
                    </A>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.sales}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.stock}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <div class="flex flex-row gap-1">
                      <div class="relative flex justify-center items-center">
                        <A
                          href={routes.category(item.categoryId)}
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
                          href={routes.categoryEdit(item.categoryId)}
                          class="peer text-base text-gray-500 hover:text-indigo-500"
                        >
                          <OcPencil3 />
                        </A>
                        <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Edit
                        </span>
                      </div>
                      <div class="relative flex justify-center items-center">
                        <A
                          href={"/"}
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
