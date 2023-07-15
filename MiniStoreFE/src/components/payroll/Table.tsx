
import { batch, For, Show } from "solid-js";
import { A } from "solid-start";
import routes from "~/utils/routes";
import { PayrollData } from "~/types";
export default function Table() {
    const payrollData:PayrollData[] = [
        {
            staffName: "John Doe",
            regularHours: 80,
            holidayHours: 16,
            timeOff: 8,
            totalHours: 104,
            grossPay: 1000,
            allApproved: true,
        },
    ];
    return (
        <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
            <table class="min-w-full table-fixed">
                <thead class="bg-[#f8fafc] text-left">
                    <tr>
                        <th scope="col" class="px-2.5 py-[8.7px] pl-[18px] w-56 text-left text-sm font-medium">
                            Staff Name
                        </th>
                        <th scope="col" class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]" style={{ "border-left": "1px dashed #d5dce6", }}>
                            Regular Hours
                        </th>
                        <th scope="col"
                            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                            style={{
                                "border-left": "1px dashed #d5dce6",
                            }}>Holidays Hours</th>
                        <th scope="col"
                            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                            style={{
                                "border-left": "1px dashed #d5dce6",
                            }}>Time-Off</th>
                        <th scope="col"
                            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                            style={{
                                "border-left": "1px dashed #d5dce6",
                            }}>Total-Hours</th>
                        <th scope="col"
                            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                            style={{
                                "border-left": "1px dashed #d5dce6",
                            }}>Gross Pay</th>
                        <th scope="col"
                            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
                            style={{
                                "border-left": "1px dashed #d5dce6",
                            }}>All Approved</th>

                    </tr>
                </thead>
                <tbody >
                        <For each={payrollData}>
                            {(item) => (
                                <tr class="hover:bg-[#ceefff] odd:bg-white even:bg-gray-50 text-[#333c48]">
                                    <td class="px-2.5 pl-[18px] text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        <A
                                            href={routes.staff(item.staffName)}
                                            class="hover:text-indigo-500"
                                        >
                                            {item.staffName}
                                        </A>
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.regularHours}
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.holidayHours}
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.timeOff}
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.totalHours}
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.grossPay}
                                    </td>
                                    <td
                                        style={{
                                            "border-left": "1px dashed #d5dce6",
                                        }}
                                        class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                                        {item.allApproved?"true":"false"}
                                    </td>
                                </tr>
                            )}
                        </For>
                </tbody>
            </table>
        </div>
    )
}