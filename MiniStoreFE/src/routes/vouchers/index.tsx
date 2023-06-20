import moment from "moment";
import { AiOutlineSearch } from "solid-icons/ai";
import { BiRegularSlider } from "solid-icons/bi";
import { IoEyeOutline, IoTrashOutline } from "solid-icons/io";
import { OcPencil3 } from "solid-icons/oc";
import { RiSystemAddFill } from "solid-icons/ri";
import { For, createSignal } from "solid-js";
import { A, createRouteData, useRouteData, useSearchParams } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import DropDownBtn from "~/components/DropDownBtn";
import Pagination from "~/components/Pagination";
import { DataResponse, Voucher } from "~/types";
import routes from "~/utils/routes";

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
      const response = await fetch(`http://localhost:3000/vouchers.json`);
      const data = (await response.json()) as DataResponse<Voucher[]>;
      return data.content;
    },
    { key: () => [searchParams.perPage ?? 10, searchParams.curPage ?? 1] }
  );
}

export default function Vouchers() {
  const [searchParams, setSearchParams] = useSearchParams<ParamType>();
  const data = useRouteData<typeof routeData>();
  const [amountFrom, setAmountFrom] = createSignal<number>(
    Number.parseInt(searchParams.amount_from || "0")
  );
  const [amountTo, setAmountTo] = createSignal<number>(
    Number.parseInt(searchParams.amount_to || "0")
  );

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
      <h1 class="mb-2 text-2xl font-medium">Vouchers</h1>
      <Breadcrumbs linkList={[{ name: "Vouchers" }]} />

      {/* Tool bar */}
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
            href={routes.voucherAdd}
            class="flex gap-1 justify-center items-center pl-3 pr-4 py-2 text-sm text-white bg-indigo-500 font-medium rounded-lg hover:bg-indigo-600"
          >
            <span class="text-lg">
              <RiSystemAddFill />
            </span>
            <span>Create Voucher</span>
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
                Code
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Discount Value
              </th>
              <th
                scope="col"
                class="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Max Discount
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Valid From
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Valid To
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
                      href={routes.product(item.voucherCode)}
                      class="hover:text-indigo-500"
                    >
                      {item.voucherCode}
                    </A>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.discountValue}{" "}
                    {item.discountType === "PERCENTAGE" ? "%" : "₫"}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {item.maxDiscount} ₫
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {moment(item.validFrom).format("DD/MM/YYYY")}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    {moment(item.validTo).format("DD/MM/YYYY")}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal">
                    <div class="flex flex-row gap-1">
                      <div class="relative flex justify-center items-center">
                        <A
                          href={routes.voucher(item.voucherCode)}
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
                          href={routes.voucherEdit(item.voucherCode)}
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
