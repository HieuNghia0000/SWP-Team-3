import { A, useRouteData } from "@solidjs/router";
import { AiOutlineSearch } from "solid-icons/ai";
import { BiRegularSlider } from "solid-icons/bi";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { RiSystemAddFill } from "solid-icons/ri";
import {For, createSignal, Show, createEffect} from "solid-js";
import { createRouteData, useSearchParams } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import DropDownBtn from "~/components/DropDownBtn";
import Pagination from "~/components/Pagination";
import { DataResponse, Product } from "~/types";
import routes from "~/utils/routes";
import handleFetchError from "~/utils/handleFetchError";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import {data} from "autoprefixer";

type ParamType = {
  search?: string;
  amount_from?: string;
  amount_to?: string;
  perPage?: string;
  curPage?: string;
};

export function routeData() {
  const [searchParams] = useSearchParams<ParamType>();

  const products = createRouteData(
    async ([perPage, curPage, amount_from, amount_to, search]) => {
      try {
        const {data} = await axios.get<DataResponse<Product[]>>(
            `${getEndPoint()}/products?perPage=${perPage}&curPage=${curPage}&amount_from=${amount_from}&amount_to=${amount_to}&search=${search}`
        );
        return data.content;
      }
      catch (e) {
        throw new Error(handleFetchError(e));
      }
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1, searchParams.amount_from ?? "", searchParams.amount_to ?? "", searchParams.search ?? ""] }
  );

  return {data: products};
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const {data} = useRouteData<typeof routeData>();
  const [amountFrom, setAmountFrom] = createSignal<number>(
    Number.parseInt(searchParams.amount_from || "0")
  );
  const [amountTo, setAmountTo] = createSignal<number>(
    Number.parseInt(searchParams.amount_to || "0")
  );

  const [products, setProducts] = createSignal<Product[]>([]);

  const totalItems = () => products()?.length ?? 0;
  const onSearchSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get("search") as string;
    setSearchParams({ search });

  };

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`${getEndPoint()}/products/delete/${productId}`);
      setProducts(products().filter((product) => product.productId !== productId));
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  createEffect(() => {
    const newData = data();
    if (newData && newData.length > 0) {
      setProducts([...newData]);
    } else {
      setProducts([]);
    }
  });

  return (
    <main>
      <h1 class="mb-2 text-2xl font-medium">Products</h1>
      <Breadcrumbs linkList={[{ name: "Products" }]} />

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
            href={routes.productAdd}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <RiSystemAddFill />
            </span>
            <span>Add Product</span>
          </A>
        </div>
        <div class="flex justify-center items-center mr-5">
          <DropDownBtn text="Filters" icon={<BiRegularSlider />}>
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
                class="px-6 py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Barcode
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
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
              <For each={products()}>
                {(item, index) => (
                    <tr class="hover:bg-gray-200 odd:bg-white even:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        <A
                            href={routes.product(item.productId)}
                            class="hover:text-indigo-500"
                        >
                          {item.productId}
                        </A>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.barCode}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.name}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.category?.name || "N/A"}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.quantity}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        {item.price} ₫
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                        <div class="flex flex-row gap-1">
                          <div class="relative flex justify-center items-center">
                            <A
                                href={routes.product(item.productId)}
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
                                href={routes.productEdit(item.productId)}
                                class="peer text-base text-gray-500 hover:text-indigo-500"
                            >
                              <OcPencil3 />
                            </A>
                            <span class="peer-hover:visible peer-hover:opacity-100 invisible opacity-0 absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded whitespace-nowrap z-10 transition-opacity duration-200 ease-in-out">
                          Edit
                        </span>
                          </div>
                          <div class="relative flex justify-center items-center">
                            <button class="peer text-base text-gray-500 hover:text-indigo-500"
                                    onclick={() => handleDelete(item.productId)}>
                              <IoTrashOutline/>
                            </button>
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
