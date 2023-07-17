import { batch, For, Show } from "solid-js";
import { OcCheckcirclefill } from "solid-icons/oc";
import { useRouteData } from "@solidjs/router";
import { routeData } from "~/routes/payroll";
import { usePRContext } from "~/context/Payroll";
import { TimesheetStatus } from "~/types";
import moment from "moment";

export default function Table() {
  const { data } = useRouteData<typeof routeData>();
  const { setChosenId, setShowModal } = usePRContext();

  let onOpenDetails = (id: number) => {
    batch(() => {
      setChosenId(id);
      setShowModal(true);
    });
  };

  return (
    <div class="flex flex-col border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
      <table class="min-w-full table-fixed">
        <thead class="bg-[#f8fafc] text-left">
        <tr>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] pl-[18px] w-44 text-left text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] w-36 text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            All Approved
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            Regular Hours
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            Leave Hours
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            Total Hours
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            Gross Pay
          </th>
          <th
            scope="col"
            class="px-2.5 py-[8.7px] text-sm font-medium text-[#637286] tracking-wider border-[#e2e7ee] border-b leading-6 shadow-[0_-10px_0_white]"
            style={{
              "border-left": "1px dashed #d5dce6",
            }}
          >
            PTO Balance
          </th>
        </tr>
        </thead>
        {/* <!-- Table row --> */}
        <tbody class="">
        <Show
          when={!data.error && !data.loading && data.state === "ready"}
          fallback={<div class="w-full h-full min-h-[300px] grid place-items-center">Something went wrong</div>}>
          <For each={data()}>
            {(staff) => {
              const isApproved = staff.shifts.findIndex((shift) => !shift.timesheet || shift.timesheet.status !== TimesheetStatus.APPROVED) === -1;
              const regularHours = staff.shifts.reduce((acc, shift) => {
                return acc + moment(shift.endTime, "HH:mm:ss").diff(moment(shift.startTime, "HH:mm:ss"), "hours");
              }, 0);
              const leaveHours = staff.shifts.reduce((acc, shift) => {
                const isAbsent = moment(`${shift.date} ${shift.endTime}`).isBefore(moment());
                const isStarted = moment(`${shift.date} ${shift.startTime}`).isSameOrBefore(moment());
                if (
                  isStarted && isAbsent &&
                  (
                    !shift.timesheet
                    || shift.timesheet.status !== TimesheetStatus.APPROVED
                    || staff.leaveRequests.some((leave) => moment(shift.date, "YYYY-MM-DD")
                      .isBetween(leave.startDate, leave.endDate, undefined, "[]"))
                  )
                )
                  return acc + moment(shift.endTime, "HH:mm:ss").diff(moment(shift.startTime, "HH:mm:ss"), "hours");

                return acc;
              }, 0);

              // let ptoBalance = staff.leaveBalance;
              // const grossPay = staff.shifts.reduce((acc, shift) => {
              //   const shiftHours = moment(shift.endTime, "HH:mm:ss").diff(moment(shift.startTime, "HH:mm:ss"), "hours");
              //   return acc + shift.salaryCoefficient * (staff.salary?.hourlyWage || 0) * shiftHours;
              //
              //   // if (
              //   //   !shift.timesheet
              //   //   || shift.timesheet.status !== TimesheetStatus.APPROVED
              //   //   || staff.leaveRequests.some((leave) => moment(shift.date, "YYYY-MM-DD").isBetween(leave.startDate, leave.endDate, undefined, "[]")
              //   //     && leave.status === LeaveRequestStatus.APPROVED)
              //   // ) {
              //   //   const ptoHours = Math.min(ptoBalance, shiftHours);
              //   //   ptoBalance -= ptoHours;
              //   //
              //   //   if (ptoBalance > 0) {
              //   //     return acc + shift.salaryCoefficient * (staff.salary?.hourlyWage || 0) * ptoHours;
              //   //   }
              //   //
              //   // }
              //   //
              //   // return acc + shift.timesheet.grossPay;
              // }, 0);

              return (
                <tr
                  class="hover:bg-[#ceefff] odd:bg-white even:bg-gray-50 text-[#333c48] cursor-pointer"
                  onClick={[ onOpenDetails, staff.staffId ]}>
                  <td
                    class="px-2.5 pl-[18px] text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    {staff.staffName}
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6" }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    <span
                      class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-bold rounded-full"
                      classList={{
                        "text-orange-400": !isApproved,
                        "text-green-400": isApproved,
                      }}
                    >
                     <OcCheckcirclefill/>
                    </span>
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6", }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    {regularHours} hrs
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6" }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    {leaveHours} hrs
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6" }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    {regularHours - leaveHours} hrs
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6" }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    ... ₫
                  </td>
                  <td
                    style={{ "border-left": "1px dashed #d5dce6" }}
                    class="px-2.5 text-sm whitespace-nowrap truncate md:hover:overflow-visible md:hover:whitespace-normal leading-10 border-[#e2e7ee] border-b">
                    {staff.leaveBalance} hrs
                  </td>
                </tr>
              )
            }}
          </For>
        </Show>
        </tbody>
      </table>
    </div>
  )
}
