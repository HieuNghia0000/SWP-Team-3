import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";
import {TbDownload} from "solid-icons/tb";;
import {OcPaperairplane2, OcPencil3} from "solid-icons/oc";
import {BsPrinter} from "solid-icons/bs";
import {createEffect, createResource, For} from "solid-js";
import axios from "axios";
import {OrderItem} from "~/types";

export default function Invoice() {
    const [data] =  createResource(async () => {
        const response = await axios.get(`http://localhost:8080/order-items/1`);
        return response.data as OrderItem[];
    });

    createEffect(() => {
        if (!data.error && data.state === "ready") console.log(data());
    });

  return (
    <main class="min-w-fit">
      <h1 class="mb-2 text-2xl font-medium">Invoice</h1>
      <Breadcrumbs
        linkList={[
          { name: "Orders", link: routes.orders },
          { name: "Invoice" },
        ]}
      />

        <div class="flex">
            {/*Invoice section*/}
            <div class="w-9/12 p-10 bg-white rounded-lg shadow-lg">
                <div class="flex items-center justify-between mb-10">
                    <div class="flex">
                        <img src="/Logo.png" alt="MiniStore Logo" class="mr-3"/>
                        <h2 class="text-2xl font-bold">MiniStore</h2>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold">Invoice</h2>
                    </div>
                </div>
                <div class="border-t border-gray-200"></div>
                <div class="flex items-center justify-between mt-10">
                    <div>
                        <p class="text-gray-500 mb-1 font-semibold">Invoice ID</p>
                        <p class="text-gray-500 mb-1 font-semibold">Date</p>
                    </div>
                    <div>
                        <p class="font-semibold">#302011</p>
                        <p class="font-semibold">2023-01-01</p>
                    </div>
                </div>

                {/*Table*/}
                <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm mt-8">
                    <table class="min-w-full table-fixed border-separate border-spacing-0.5 border-white">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left px-4 py-2" scope="col">Product</th>
                                <th class="text-left px-4 py-2" scope="col">SKU</th>
                                <th class="text-left px-4 py-2" scope="col">QTY</th>
                                <th class="text-left px-4 py-2" scope="col">Price</th>
                                <th class="text-right px-4 py-2" scope="col">Total</th>
                            </tr>
                        </thead>

                        {/*Table row*/}
                        <tbody>
                        <For each={data()}>
                            {(item, index) => (
                                <tr>
                                    <td class="px-4 py-2 text-gray-500 font-medium">{item.product.name}</td>
                                    <td class="px-4 py-2">{item.product.barCode}</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">{item.quantity} pcs</td>
                                    <td class="px-4 py-2 text-gray-500 font-medium">${item.product.price.toFixed(2)}</td>
                                    <td class="px-4 py-2 text-right text-gray-500 font-medium">${(item.product.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            )}
                        </For>
                        </tbody>

                        {/*Total price*/}
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2">Subtotal</td>
                                <td class="px-4 py-2 text-right">$40.00</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2">Vouchers</td>
                                <td class="px-4 py-2 text-right">-$5.00</td>
                            </tr>
                            <tr>
                                <td colspan="4" class="text-right px-4 py-2">Grand Total</td>
                                <td class="px-4 py-2 text-right">$35.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/*Footer*/}
                <div class="flex justify-center mt-8">
                    <p class="text-gray-500">Should you have inquiries concerning this invoice, please contact <span class="font-bold">Martha</span> on +1 (469) 227 9044</p>
                </div>
            </div>
            
            {/*Invoice button*/}
            <div class="w-3/12 px-4">
                <div class="flex flex-col justify-between shadow-lg p-6 rounded-lg bg-white">
                    <button class="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2 px-4 rounded-lg mb-4">
                      <span class="inline-flex items-center">
                        <span class="mr-1">
                          <OcPaperairplane2 />
                        </span>
                        Send Invoice
                      </span>
                    </button>

                    <button class="bg-[#dedefa] hover:bg-[#d6d6ff] active:bg-[#c5c5fc] text-indigo-500 font-bold py-2 px-4 rounded-lg mb-4">
                        <span class="inline-flex items-center">
                            <span class="mr-1">
                              <TbDownload/>
                            </span>
                            Download Invoice
                        </span>
                    </button>
                    <button class="bg-[#dedefa] hover:bg-[#d6d6ff] active:bg-[#c5c5fc] text-indigo-500 font-bold py-2 px-4 rounded-lg mb-4">
                        <span class="inline-flex items-center">
                            <span class="mr-1">
                              <BsPrinter />
                            </span>
                            Print Invoice
                        </span>
                    </button>
                    <button class="bg-[#dedefa] hover:bg-[#d6d6ff] active:bg-[#c5c5fc] text-indigo-500 font-bold py-2 px-4 rounded-lg">
                        <span class="inline-flex items-center">
                            <span class="mr-1">
                              <OcPencil3 />
                            </span>
                            Edit Invoice
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </main>
  );
}
