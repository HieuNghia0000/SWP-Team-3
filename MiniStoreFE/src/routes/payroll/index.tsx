import { createSignal, For, onCleanup } from "solid-js";
import { PayrollData, PayrollPeriod, PayrollState, StaffPayrollData } from "~/types";

function ViewPayroll() {
  const [ payrollState, setPayrollState ] = createSignal<PayrollState>({
    currentPayrollPeriod: { startDate: "", endDate: "" },
    payrollData: [],
    selectedStaffPayroll: [],
  });

  function navigateToPayrollManagement() {
    // Code to navigate to the "Payroll management" section
    // Display an overview of the current payroll period
    const payrollPeriod: PayrollPeriod = {
      startDate: "2023-07-01",
      endDate: "2023-07-14",
    };
    setPayrollState((prevState) => ({
      ...prevState,
      currentPayrollPeriod: payrollPeriod,
    }));

    // Fetch payroll data for the current payroll period
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

    setPayrollState((prevState) => ({
      ...prevState,
      payrollData,
    }));
  }

  function selectPayrollPeriod(payrollPeriod: PayrollPeriod) {
    // Fetch and set payroll data for the selected payroll period
    const payrollData: PayrollData[] = [
      // Fetch payroll data for the selected payroll period
    ];

    setPayrollState((prevState) => ({
      ...prevState,
      currentPayrollPeriod: payrollPeriod,
      payrollData,
    }));
  }

  function selectStaffPayroll(staffName: string) {
    // Fetch and set detailed breakdown of hours and pay for the selected staff payroll
    const selectedStaffPayroll: StaffPayrollData[] = [
      // Fetch detailed breakdown of hours and pay for the selected staff payroll
    ];

    setPayrollState((prevState) => ({
      ...prevState,
      selectedStaffPayroll,
    }));
  }

  onCleanup(() => {

  });

  return (
    <div>
      <h1>View Payroll</h1>
      <button onClick={navigateToPayrollManagement}>Go to Payroll Management</button>
      <h2>Current Payroll Period</h2>
      <p>Start Date: {payrollState().currentPayrollPeriod.startDate}</p>
      <p>End Date: {payrollState().currentPayrollPeriod.endDate}</p>
      <h2>Payroll Data</h2>
      <table>
        <thead>
        <tr>
          <th>Staff Name</th>
          <th>Regular Hours</th>
          <th>Holiday Hours</th>
          <th>Time Off</th>
          <th>Total Hours</th>
          <th>Gross Pay</th>
          <th>All Approved</th>
        </tr>
        </thead>
        <tbody>
        <For each={payrollState().payrollData}>
          {data => (
            <tr>
              <td>{data.staffName}</td>
              <td>{data.regularHours}</td>
              <td>{data.holidayHours}</td>
              <td>{data.timeOff}</td>
              <td>{data.totalHours}</td>
              <td>{data.grossPay}</td>
              <td>{data.allApproved ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => selectStaffPayroll(data.staffName)}>View Details</button>
              </td>
            </tr>
          )}
        </For>
        </tbody>
      </table>
      <h2>Selected Staff Payroll</h2>
      <table>
        <thead>
        <tr>
          <th>Day</th>
          <th>Regular Hours</th>
          <th>Holiday Hours</th>
          <th>Time Off</th>
          <th>Total Hours</th>
          <th>Gross Pay</th>
        </tr>
        </thead>
        <tbody>
        <For each={payrollState().selectedStaffPayroll}>
          {staffPayroll => (
            <tr>
              <td>{staffPayroll.day}</td>
              <td>{staffPayroll.regularHours}</td>
              <td>{staffPayroll.holidayHours}</td>
              <td>{staffPayroll.timeOff}</td>
              <td>{staffPayroll.totalHours}</td>
              <td>{staffPayroll.grossPay}</td>
            </tr>
          )}
        </For>
        </tbody>
      </table>
    </div>
  )
    ;
}

export default ViewPayroll;