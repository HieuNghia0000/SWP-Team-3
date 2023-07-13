import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import {FaRegularCalendarCheck, FaRegularUser} from "solid-icons/fa";
import {OcMail2} from "solid-icons/oc";
import {CgSmartphone} from "solid-icons/cg";
import {DataResponse, OrderItem, Product} from "~/types";
import {createEffect, createResource, createSignal, For, Show} from "solid-js";
import axios from "axios";

export default function OrderDetails() {
    const [data] =  createResource(async () => {
        const response = await axios.get(`http://localhost:8080/order-items/1`);
        return response.data as OrderItem[];
    });

    createEffect(() => {
        if (!data.error && data.state === "ready") console.log(data());
    });

    const subTotal = () => {
        let calculateSubTotal = 0;
        data()?.forEach(item => {
            const itemSubTotal = item.product.price * item.quantity;
            calculateSubTotal += itemSubTotal;
        });

      return calculateSubTotal;
    };

    return (
        <main class="min-w-fit">
            <h1 class="mb-2 text-2xl font-medium">Order Details</h1>
            <Breadcrumbs linkList={[
                {name: "Orders", link: routes.orders},
                {name: "Order Details"}
            ]}/>


            <div class="flex justify-between">
                {/*Order*/}
                <div class="bg-white rounded-lg w-5/12 shadow-lg p-4 border border-gray-300">
                    <h2 class="text-xl font-medium mb-4">Order #302011</h2>
                    <div class="flex justify-between">
                        <div class="flex items-center">
                            <div class="border border-gray-100 bg-gray-100 p-1 rounded-full">
                                <div class="border border-gray-200 bg-gray-200 p-1.5 rounded-full text-gray-500">
                                    <span class="text-lg">
                                        <FaRegularCalendarCheck />
                                    </span>
                                </div>
                            </div>
                            <p class="ml-2 text-gray-500 font-semibold">Added</p>
                        </div>
                        <div>
                            <p class="font-semibold">12 Dec 2022</p>
                        </div>
                    </div>
                </div>

                {/*Cashier*/}
                <div class="bg-white rounded-lg w-5/12 shadow-lg p-4 border border-gray-300">
                    <div>
                        <h2 class="text-xl font-medium mb-4">Cashier</h2>
                        <div class="flex justify-between">
                            <div class="flex items-center">
                                <div class="border border-gray-100 bg-gray-100 p-1 rounded-full">
                                    <div class="border border-gray-200 bg-gray-200 p-1.5 rounded-full text-gray-500">
                                        <span class="text-lg">
                                            <FaRegularUser />
                                        </span>
                                    </div>
                                </div>
                                <p class="ml-2 text-gray-500 font-semibold">Cashier</p>
                            </div>
                            <div>
                                <p class="font-semibold">Josh Adam</p>
                            </div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <div class="flex items-center">
                                <div class="border border-gray-100 bg-gray-100 p-1 rounded-full">
                                    <div class="border border-gray-200 bg-gray-200 p-1.5 rounded-full text-gray-500">
                                        <span class="text-lg">
                                            <OcMail2 />
                                        </span>
                                    </div>
                                </div>
                                <p class="ml-2 text-gray-500 font-semibold">Email</p>
                            </div>
                            <div>
                                <p class="font-semibold">josh_adam@mail.com</p>
                            </div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <div class="flex items-center">
                                <div class="border border-gray-100 bg-gray-100 p-1 rounded-full">
                                    <div class="border border-gray-200 bg-gray-200 p-1.5 rounded-full text-gray-500">
                                        <span class="text-xl">
                                            <CgSmartphone />
                                        </span>
                                    </div>
                                </div>
                                <p class="ml-2 text-gray-500 font-semibold">Phone</p>
                            </div>
                            <div>
                                <p class="font-semibold">909 427 2910</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Order List*/}
            <div class="w-full bg-white rounded-lg shadow-lg mt-4 p-4 border border-gray-300">
                <div class="flex items-center">
                    <h2 class="text-xl font-medium mr-2">Order List</h2>
                    <div class="rounded-lg bg-green-100 pl-4 pr-4">
                        <p class="text-green-700 font-semibold">
                            {data()?.length} Products
                        </p>
                    </div>
                </div>

                {/*Table*/}
                <div class="flex flex-col overflow-x-auto mt-8">
                    <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">

                        {/*Table head*/}
                        <thead>
                            <tr>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Product</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">Barcode</th>
                                <th class="text-left px-4 py-2 font-medium" scope="col">QTY</th>
                                <th class="text-right px-4 py-2 font-medium" scope="col">Price</th>
                                <th class="text-right px-4 py-2 font-medium" scope="col">Total</th>
                            </tr>
                        </thead>

                        {/*Table row*/}
                        <tbody>
                        <Show when={!data.error && data() != undefined}>
                            <For each={data()}>
                                {(item, index) => (
                                    <tr>
                                        <td class="px-4 py-2 text-gray-500 font-medium">{item.product.name}</td>
                                        <td class="px-4 py-2 text-indigo-500 font-bold">{item.product.barCode}</td>
                                        <td class="px-4 py-2 text-gray-500 font-medium">{item.quantity} pcs</td>
                                        <td class="px-4 py-2 text-right text-gray-500 font-medium">${item.product.price.toFixed(2)}</td>
                                        <td class="px-4 py-2 text-right text-gray-500 font-medium">${(item.product.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                )}
                            </For>
                        </Show>
                        </tbody>

                        {/*Total price*/}
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2 font-medium">Subtotal</td>
                                <td class="px-4 py-2 text-right font-medium">${subTotal().toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2 font-medium">VAT</td>
                                <td class="px-4 py-2 text-right font-medium">$0</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2 font-medium">Shipping Rate</td>
                                <td class="px-4 py-2 text-right font-medium">$5.00</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2 font-medium">Grand Total</td>
                                <td class="px-4 py-2 text-right font-bold">$580.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </main>
    )
}