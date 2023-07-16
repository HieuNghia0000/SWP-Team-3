import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import {FiShoppingCart} from "solid-icons/fi";
import {CgTrash} from "solid-icons/cg";
import {AiOutlineSearch} from "solid-icons/ai";
import {OcPaperairplane2} from "solid-icons/oc";
import {FaSolidArrowRotateRight, FaSolidPlus} from "solid-icons/fa";
import {createRouteData, useSearchParams} from "solid-start";
import axios from "axios";
import {DataResponse, Product} from "~/types";
import getEndPoint from "~/utils/getEndPoint";
import handleFetchError from "~/utils/handleFetchError";
import {For} from "solid-js";
import {useRouteData} from "@solidjs/router";
import Pagination from "~/components/Pagination";

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

export default function AddOrders() {
    const [searchParams, setSearchParams] = useSearchParams<ParamType>();
    const {data} = useRouteData<typeof routeData>();

    const totalItems = () => data()?.length ?? 0;

    const onSearchSubmit = (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const search = formData.get("search") as string;
        setSearchParams({ search });
    };

    return (
        <main class="min-w-fit">
            <h1 class="mb-2 text-2xl font-medium">Add Orders</h1>
            <Breadcrumbs linkList={[
                {name: "Orders", link: routes.orders},
                {name: "Add Orders"}
            ]}/>

            <div class="flex justify-between">

                {/*Orders*/}
                <div class="w-6/12">
                    {/*Order ID*/}
                    <div class="bg-blue-300 p-3">
                        <div class="flex justify-around text-indigo-500">
                            <div class="flex items-center">
                                <FiShoppingCart />
                                <h2 class="ml-2 text-xl font-medium">Order ID #01</h2>
                            </div>
                            <h2 class="text-xl font-medium">Date 20-06-2023</h2>
                        </div>
                    </div>

                    {/*Product List*/}
                    <div class="flex flex-col overflow-x-auto">
                        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">

                            {/*Table head*/}
                            <thead>
                            <tr>
                                <th class="text-left px-4 py-2 font-medium" scope="col">ProductID</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Product</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Price</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Quantity</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Subtotal</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Action</th>
                            </tr>
                            </thead>

                            {/*Table row*/}
                            <tbody>
                                <tr>
                                    <td class="px-4 py-2 text-indigo-500 font-bold">#302011</td>
                                    <td class="px-4 py-2 font-medium">Smartwatch E2</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">$400.00</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">1 pcs</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">$400.00</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">
                                        <span class="text-xl">
                                            <CgTrash />
                                        </span>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/*Voucher code*/}
                    <div class="mt-4">
                        <p class="ml-4 mb-1 font-medium text-gray-500">Voucher code:</p>
                        <form class="relative">
                            <input
                                type="text"
                                class="w-full max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
                                placeholder="Fill in the voucher code..."
                                name="fillVouchers"
                                value=""/>
                            <button
                                class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
                                type="submit"
                                title="Search">
                                <AiOutlineSearch />
                            </button>
                        </form>
                    </div>

                    {/*Grand total*/}
                    <div class="bg-indigo-200 p-3 mt-4">
                        <div class="text-indigo-500">
                            <h2 class="text-3xl text-indigo-600 font-medium text-center">Grand Total: $5000.00</h2>
                        </div>
                    </div>

                    {/*Interactive button*/}
                    <div class="flex justify-between mt-4 p-4">
                        <button type="button" class="flex items-center bg-red-500 px-12 py-2 text-white font-medium rounded-lg hover:bg-red-600">
                            <span class="text-lg mr-2"><FaSolidArrowRotateRight /></span>
                            <span>Reset</span>
                        </button>
                        <button type="submit" class="flex items-center bg-green-700 px-12 py-2 text-white font-medium rounded-lg hover:bg-green-800">
                            <span class="text-lg mr-2"><OcPaperairplane2 /></span>
                            <span>Pay now</span>
                        </button>
                    </div>
                </div>

                {/*Add Orders*/}
                <div class="w-5/12">

                    {/*Search product*/}
                    <div>
                        <form class="relative" onSubmit={onSearchSubmit}>
                            <input
                                type="text"
                                class="w-full max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
                                placeholder="Search the product by Name"
                                name="search"
                                value=""/>
                            <button
                                class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg"
                                type="submit"
                                title="Search">
                                <AiOutlineSearch />
                            </button>
                        </form>
                    </div>

                    {/*Product list*/}
                    <div class="flex flex-col overflow-x-auto">
                        <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">

                            {/*Table head*/}
                            <thead>
                            <tr>
                                <th class="text-left px-4 py-2 font-medium" scope="col">ProductID</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Product</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Category</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Price</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Action</th>
                            </tr>
                            </thead>

                            {/*Table row*/}
                            <tbody>
                            <For each={data()}>
                                {(item, index) => (
                                    <tr>
                                        <td class="px-4 py-2 text-indigo-500 font-bold">{item.productId}</td>
                                        <td class="px-4 py-2 font-medium">{item.name}</td>
                                        <td class="px-4 py-2 font-medium text-gray-500">{item.category?.name || "N/A"}</td>
                                        <td class="px-4 py-2 text-gray-500 font-medium">${item.price.toFixed(2)}</td>
                                        <td class="px-4 py-2 text-gray-500 font-medium">
                                    <span class="text-xl">
                                        <FaSolidPlus />
                                    </span>
                                        </td>
                                    </tr>
                                )}
                            </For>
                            </tbody>
                        </table>

                        <Pagination totalItems={totalItems}/>
                    </div>
                </div>
            </div>
        </main>
    )
}