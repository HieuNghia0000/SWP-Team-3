import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import {FiShoppingCart} from "solid-icons/fi";
import {CgTrash} from "solid-icons/cg";
import {AiOutlineSearch} from "solid-icons/ai";
import {OcPaperairplane2} from "solid-icons/oc";
import {FaSolidArrowRotateRight, FaSolidPlus} from "solid-icons/fa";

export default function AddOrders() {
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
                                    <td class="px-4 py-2 text-gray-500 font-medium">1 pcs</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">$400.00</td>
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
                        <form class="relative">
                            <input
                                type="text"
                                class="w-full max-w-full border-gray-300 rounded-lg py-2 px-4 leading-tight pl-12 border-0 ring-1 ring-inset ring-gray-300 outline-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
                                placeholder="Search the product by Name/Barcode"
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
                            <tr>
                                <td class="px-4 py-2 text-indigo-500 font-bold">#302011</td>
                                <td class="px-4 py-2 font-medium">Smartwatch E2</td>
                                <td class="px-4 py-2 font-medium text-gray-500">Watch</td>
                                <td class="px-4 py-2 text-gray-500 font-medium">$400.00</td>
                                <td class="px-4 py-2 text-gray-500 font-medium">
                                    <span class="text-xl">
                                        <FaSolidPlus />
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}