import { createSignal, For, onCleanup } from "solid-js";
import { useSearchParams } from "solid-start";
import { PayrollData, PayrollPeriod, PayrollState, StaffPayrollData } from "~/types";
import handleFetchError from "~/utils/handleFetchError";
import { createRouteAction, createRouteData, useRouteData} from "solid-start";
import { ParamType } from "~/components/payroll/types";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import Pagination from "~/components/Pagination";
import Table from "~/components/payroll/Table";
import Toolbar from "~/components/payroll/Toolbar";
// import { DataResponse, PayrollData } from "~/types";

// export function routeData(){
//   const [ params ] = useSearchParams<ParamType>();
//   const payroll = createRouteData(
//     async ([key,perPage, curPage, search]) => {
//       try {
//         const { data } = await axios.get<DataResponse<PayrollData[]>>(
//           `${getEndPoint()}/${key}?perPage=${perPage}&curPage=${curPage}&search=${search}`
//         );
//         return data.content;
//       } catch(e) {
//         throw new Error(handleFetchError(e));
//       }
//     },
//     {
//       key : () => [ "payroll/list", params.perPage ?? 10 ,params.curPage ?? 1, params.]
//     }
//   )
// }

// function ViewPayroll() {
//   const [ payrollState, setPayrollState ] = createSignal<PayrollState>({
//     currentPayrollPeriod: { startDate: "", endDate: "" },
//     payrollData: [],
//     selectedStaffPayroll: [],
//   });

// function navigateToPayrollManagement() {
//     // Code to navigate to the "Payroll management" section
//     // Display an overview of the current payroll period
//     const payrollPeriod: PayrollPeriod = {
//       startDate: "2023-07-01",
//       endDate: "2023-07-14",
//     };
//     setPayrollState((prevState) => ({
//       ...prevState,
//       currentPayrollPeriod: payrollPeriod,
//     }));

//     // Fetch payroll data for the current payroll period
    const payrollData: PayrollData[] = [
      {
        staffName: "John Doe",
        regularHours: 80,
        holidayHours: 16,
        timeOff: 8,
        totalHours: 104,
        grossPay: 1000,
        allApproved: true,
      },
      // Add more payroll data for other staff members
    ];

//     setPayrollState((prevState) => ({
//       ...prevState,
//       payrollData,
//     }));
//   }

//   function selectPayrollPeriod(payrollPeriod: PayrollPeriod) {
//     // Fetch and set payroll data for the selected payroll period
//     const payrollData: PayrollData[] = [
//       // Fetch payroll data for the selected payroll period
//     ];

//     setPayrollState((prevState) => ({
//       ...prevState,
//       currentPayrollPeriod: payrollPeriod,
//       payrollData,
//     }));
//   }

//   function selectStaffPayroll(staffName: string) {
//     // Fetch and set detailed breakdown of hours and pay for the selected staff payroll
//     const selectedStaffPayroll: StaffPayrollData[] = [
//       // Fetch detailed breakdown of hours and pay for the selected staff payroll
//     ];

//     setPayrollState((prevState) => ({
//       ...prevState,
//       selectedStaffPayroll,
//     }));
//   }

//   onCleanup(() => {

//   });

//   return (
//     <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm" >
//       <table class="min-w-full table-fixed">
//         <thead class="bg-[#f8fafc] text-left">
//         <tr>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] pl-[18px] w-56 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//           >
//             Staff Member
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
            
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
//             Start Date
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
//             End Date
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
//             Status
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
//             Note
//           </th>
//           <th
//             scope="col"
//             class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
//             style={{
//               "border-left": "1px dashed #d5dce6",
//             }}
//           >
//             Actions
//           </th>
//         </tr>
//         </thead>
//       </table>
        
//       {/* <h1>View Payroll</h1>
//       <button onClick={navigateToPayrollManagement}>Go to Payroll Management</button>
//       <h2>Current Payroll Period</h2>
//       <p>Start Date: {payrollState().currentPayrollPeriod.startDate}</p>
//       <p>End Date: {payrollState().currentPayrollPeriod.endDate}</p>
//       <h2>Payroll Data</h2>
//       <table>
//         <thead>
//         <tr>
//           <th>Staff Name</th>
//           <th>Regular Hours</th>
//           <th>Holiday Hours</th>
//           <th>Time Off</th>
//           <th>Total Hours</th>
//           <th>Gross Pay</th>
//           <th>All Approved</th>
//         </tr>
//         </thead>
//         <tbody>
//         <For each={payrollState().payrollData}>
//           {data => (
//             <tr>
//               <td>{data.staffName}</td>
//               <td>{data.regularHours}</td>
//               <td>{data.holidayHours}</td>
//               <td>{data.timeOff}</td>
//               <td>{data.totalHours}</td>
//               <td>{data.grossPay}</td>
//               <td>{data.allApproved ? "Yes" : "No"}</td>
//               <td>
//                 <button onClick={() => selectStaffPayroll(data.staffName)}>View Details</button>
//               </td>
//             </tr>
//           )}
//         </For>
//         </tbody>
//       </table>
//       <h2>Selected Staff Payroll</h2>
//       <table>
//         <thead>
//         <tr>
//           <th>Day</th>
//           <th>Regular Hours</th>
//           <th>Holiday Hours</th>
//           <th>Time Off</th>
//           <th>Total Hours</th>
//           <th>Gross Pay</th>
//         </tr>
//         </thead>
//         <tbody>
//         <For each={payrollState().selectedStaffPayroll}>
//           {staffPayroll => (
//             <tr>
//               <td>{staffPayroll.day}</td>
//               <td>{staffPayroll.regularHours}</td>
//               <td>{staffPayroll.holidayHours}</td>
//               <td>{staffPayroll.timeOff}</td>
//               <td>{staffPayroll.totalHours}</td>
//               <td>{staffPayroll.grossPay}</td>
//             </tr>
//           )}
//         </For>
//         </tbody>
//       </table> */}
//     </div>
//   )
//     ;
// }

// export default ViewPayroll;
export default function Payroll(){
  return (
    <main>
      {/* <Toolbar/> */}
      
      <Table/>

    </main>
  );
}
