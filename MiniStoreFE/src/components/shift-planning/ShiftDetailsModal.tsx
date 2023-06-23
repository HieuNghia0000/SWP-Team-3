import {
  Accessor,
  Component,
  Match,
  ResourceFetcher,
  Setter,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import PopupModal from "../PopupModal";
import { DataResponse, Role, Shift, WorkSchedule } from "~/types";
import { FaSolidPencil, FaSolidTrash } from "solid-icons/fa";
import moment from "moment";
import * as yup from "yup";
import { TextInput } from "../form/TextInput";
import { timeOptions } from "./utils/timeOptions";
import { Select } from "../form/Select";
import Spinner from "../Spinner";
import {
  readableToTimeStr,
  shiftTimes,
  timeToReadable,
} from "./utils/shiftTimes";
import { capitalize } from "~/utils/capitalize";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { useSPData } from "~/context/ShiftPlanning";
import { Checkboxes } from "../form/Checkboxes";
import { BsCheckCircle, BsExclamationCircle } from "solid-icons/bs";
import { compact, flattenDeep } from "lodash";

type Tabs = "details" | "edit" | "errors" | "copy";
const ShiftDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  const [state, setState] = createSignal<Tabs>("details");

  const onCloseModal = () => {
    setShowModal(false);
    setState("details");
  };

  return (
    <PopupModal.Wrapper
      title={state() === "details" ? "Shift Details" : "Edit Shift"}
      close={onCloseModal}
      open={showModal}
      headerTabs={[
        {
          name: "Details",
          stateName: "details",
          onClick: () => setState("details"),
        },
        {
          name: (
            <>
              <span>Errors</span>
              <div class="h-3.5 w-3.5 inline-block text-[10px] leading-[14px] text-center font-semibold ml-1 rounded-full text-white bg-red-600">
                1
              </div>
            </>
          ),
          stateName: "errors",
          onClick: () => setState("errors"),
        },
        {
          name: "Copy",
          stateName: "copy",
          onClick: () => setState("copy"),
        },
      ]}
      headerTabSelected={state}
    >
      <Switch>
        <Match when={state() === "details"}>
          <Details shift={modalData} setState={setState} />
        </Match>
        <Match when={state() === "edit"}>
          <Edit
            modalState={state}
            setModalState={setState}
            modalData={modalData}
          />
        </Match>
        <Match when={state() === "errors"}>
          <Errors shift={modalData} setState={setState} />
        </Match>
        <Match when={state() === "copy"}>
          <Copy shift={modalData} setState={setState} />
        </Match>
      </Switch>
    </PopupModal.Wrapper>
  );
};

export default ShiftDetailsModal;

// Details tab
interface DetailsProps {
  shift: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setState: Setter<Tabs>;
}
const Details: Component<DetailsProps> = ({ shift, setState }) => {
  return (
    <>
      <PopupModal.Body>
        <div class="text-xl font-semibold text-center text-gray-800">
          {shift()?.shift.shiftName}
        </div>
        <div
          class="text-sm mb-2.5 font-semibold text-center italic text-gray-500"
          classList={{ "text-green-600": shift()?.published }}
        >
          {shift()?.published ? "Published" : "Not Published"}
        </div>
        <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Team Member:</span>
              <span>{shift()?.staff!.staffName}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">
                Salary Coefficient:
              </span>
              <span>{shift()?.shift.salaryCoefficient}</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Required Role:</span>
              <span
                class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
                classList={{
                  "bg-blue-200 text-blue-700":
                    shift()?.shift.role === Role.CASHIER,
                  "bg-yellow-200 text-yellow-700":
                    shift()?.shift.role === Role.GUARD,
                  "bg-red-200 text-red-700":
                    shift()?.shift.role === Role.MANAGER,
                  "bg-gray-200 text-gray-700":
                    shift()?.shift.role === Role.ADMIN,
                }}
              >
                {shift()?.shift.role}
              </span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Date:</span>
              <span>{moment(shift()?.date).format("ddd MMM D, YYYY")}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Start Time:</span>
              <span>
                {moment(shift()?.shift.startTime, "h:mm:ss").format("h:mma")}
              </span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">End Time:</span>
              <span>
                {moment(shift()?.shift.endTime, "h:mm:ss").format("h:mma")}
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Status:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-in Time:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-out Time:</span>
              <span>Not yet</span>
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <button
          onClick={[setState, "edit"]}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Shift
        </button>
      </PopupModal.Footer>
    </>
  );
};

// Edit tab
type EditScheduleForm = {
  shiftId: number;
  staffId: number;
  startTime: string;
  endTime: string;
  coefficient: number;
  role: Role | "All roles";
  date: Date;
};

const validTimeOptions = timeOptions().map((item) => item.label);
const schema: yup.Schema<EditScheduleForm> = yup.object({
  shiftId: yup
    .number()
    .min(1, "Please select a shift template")
    .required("Please select a shift template"),
  staffId: yup
    .number()
    .min(1, "Please select a staff")
    .required("Please select a staff"),
  startTime: yup
    .string()
    .oneOf(validTimeOptions, "Invalid time options")
    .required("Please select a start time"),
  endTime: yup
    .string()
    .oneOf(validTimeOptions, "Invalid time options")
    .required("Please select a end time"),
  role: yup
    .string()
    .oneOf(
      [Role.MANAGER, Role.CASHIER, Role.GUARD, "All roles"],
      "Invalid role"
    )
    .required("Please select a role"),
  coefficient: yup
    .number()
    .min(1, "Coefficient can not below 1")
    .required("Please select a coefficient"),
  date: yup.date().required("Please select a date"),
});
const fetcher: ResourceFetcher<
  boolean,
  Shift[],
  { state: Tabs }
> = async () => {
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(`http://localhost:3000/shifts.json`);
  const data: DataResponse<Shift[]> = await response.json();

  return data.content;
};
interface EditProps {
  setModalState: Setter<Tabs>;
  modalState: Accessor<Tabs>;
  modalData: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
}
const Edit: Component<EditProps> = ({
  setModalState,
  modalData,
  modalState,
}) => {
  const { tableData } = useSPData();
  const [shiftTemplates, { refetch, mutate }] = createResource(
    () => modalState() === "edit",
    fetcher
  );
  const [chosenTemplate, setChosenTemplate] = createSignal<number>(0);
  const formHandler = useFormHandler(yupSchema(schema));
  const { formData, setFieldValue } = formHandler;

  createEffect(() => {
    if (modalState() !== "edit") {
      formHandler.resetForm();
      setChosenTemplate(0);
    }
  });

  const submit = async (publish: boolean, event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      alert(
        "Data sent with success: " +
          JSON.stringify({
            ...formData(),
            startTime: readableToTimeStr(formData().startTime),
            endTime: readableToTimeStr(formData().endTime),
            scheduleId: modalData()?.scheduleId,
            role: formData().role === "All roles" ? "" : formData().role,
            published: publish,
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shiftOptions = () => {
    return shiftTemplates()?.map((shift) => ({
      value: shift.shiftId,
      label: `${shift.shiftName} (${shiftTimes(
        shift.startTime,
        shift.endTime
      )}) [${!shift.role ? "All roles" : capitalize(shift.role) + " only"}]`,
    }));
  };

  const onChangeTemplate = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    setChosenTemplate(Number.parseInt(target.value));
    const template = shiftTemplates()?.find(
      (shift) => shift.shiftId === chosenTemplate()
    );
    const coefficient = template?.salaryCoefficient || 0;
    const role = template?.role || "All roles";
    const startTime = template?.startTime;
    const endTime = template?.endTime;

    setFieldValue("coefficient", coefficient);
    setFieldValue("role", role);
    setFieldValue("startTime", timeToReadable(startTime!));
    setFieldValue("endTime", timeToReadable(endTime!));
  };

  const reset = () => {
    formHandler.resetForm();
  };

  const onCancel = () => {
    reset();
    setModalState("details");
    setChosenTemplate(0);
  };

  const onDelete = async () => {
    alert("Delete");
  };

  return (
    <>
      <PopupModal.Body>
        <Show when={shiftTemplates.loading}>
          <div class="w-full min-h-[300px] grid place-items-center">
            <Spinner />
          </div>
        </Show>
        <Show when={!shiftTemplates.loading}>
          <form class="text-sm" onSubmit={[submit, false]}>
            <div class="flex">
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="shiftId" class="text-gray-700 font-semibold">
                  Shift Template
                </label>
                <Select
                  id="shiftId"
                  name="shiftId"
                  value={modalData()?.shift.shiftId || 0}
                  placeholder="Select a shift template"
                  options={shiftOptions()}
                  onChange={onChangeTemplate}
                  formHandler={formHandler}
                />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="staffId" class="text-gray-700 font-semibold">
                  Staff Members
                </label>
                <Select
                  id="staffId"
                  name="staffId"
                  value={modalData()?.staff?.staffId || 0}
                  placeholder="Select a staff member"
                  options={tableData.staffs.map((staff) => ({
                    value: staff.staffId,
                    label: staff.staffName,
                  }))}
                  formHandler={formHandler}
                />
              </div>
              <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1">
                <label for="coefficient" class="text-gray-700 font-semibold">
                  Salary Coefficient
                </label>
                <TextInput
                  id="coefficient"
                  name="coefficient"
                  type="number"
                  disabled
                  value={modalData()?.shift.salaryCoefficient || 0}
                  step={0.1}
                  formHandler={formHandler}
                />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="role" class="text-gray-700 font-semibold">
                  Required Role
                </label>
                <TextInput
                  id="role"
                  name="role"
                  value={modalData()?.shift.role || "All roles"}
                  disabled
                  formHandler={formHandler}
                />
              </div>
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="date" class="text-gray-700 font-semibold">
                  Date
                </label>
                <TextInput
                  id="date"
                  name="date"
                  type="date"
                  value={modalData()?.date || ""}
                  formHandler={formHandler}
                />
              </div>
            </div>
            <div class="flex gap-2">
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="startTime" class="text-gray-700 font-semibold">
                  Start Time
                </label>
                <TextInput
                  id="startTime"
                  name="startTime"
                  value={timeToReadable(modalData()?.shift?.startTime!)}
                  disabled
                  placeholder="e.g 5am"
                  formHandler={formHandler}
                />
              </div>
              <div class="flex-1 py-2.5 flex flex-col gap-1">
                <label for="endTime" class="text-gray-700 font-semibold">
                  End Time
                </label>
                <TextInput
                  id="endTime"
                  name="endTime"
                  value={timeToReadable(modalData()?.shift?.endTime!)}
                  placeholder="e.g 5pm"
                  disabled
                  formHandler={formHandler}
                />
              </div>
            </div>
          </form>
        </Show>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={onDelete}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              <span>
                <FaSolidTrash />
              </span>
              <span>Delete</span>
            </button>
          </div>
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={onCancel}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={[submit, !modalData()?.published]}
              class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
            >
              Save & {modalData()?.published ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              onClick={[submit, modalData()?.published]}
              class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </PopupModal.Footer>
    </>
  );
};

// Error Tab
interface ErrorsProps {
  shift: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setState: Setter<Tabs>;
}
const Errors: Component<ErrorsProps> = ({ shift, setState }) => {
  return (
    <>
      <PopupModal.Body>
        <div class="p-5 mb-5 -mx-5 -mt-5 border-b border-gray-200">
          <div
            class="rounded mx-0.5 p-2 relative text-left select-none"
            classList={{
              "bg-[#edf2f7] text-black":
                shift()?.published && shift()?.isOrigin,
              "bg-blue-100 text-blue-500 border border-blue-100":
                shift()?.published && !shift()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
                !shift()?.published && shift()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] border border-blue-100":
                !shift()?.published && !shift()?.isOrigin,
            }}
          >
            <i
              class="absolute top-1 left-1.5 bottom-1 w-1.5 rounded"
              classList={{
                "bg-blue-500": shift()?.shift.role === Role.CASHIER,
                "bg-yellow-500": shift()?.shift.role === Role.GUARD,
                "bg-red-500": shift()?.shift.role === Role.MANAGER,
                "bg-gray-500": shift()?.shift.role === Role.ADMIN,
              }}
            ></i>
            <p class="ml-3.5 font-semibold text-base tracking-wider">
              {shiftTimes(
                shift()?.shift.startTime || "",
                shift()?.shift.endTime || ""
              )}
            </p>
            <p class="ml-3.5 font-normal text-sm tracking-wider">
              {shift()?.shift.shiftName}
            </p>
          </div>
        </div>
        <div class="mb-4 w-[560px]">
          <label class="mb-1.5 font-semibold text-gray-600 inline-block">
            Ignore Shift Error Rules
          </label>
          <p class="text-gray-400 text-sm tracking-wide">
            The table below is a breakdown of your error rules for this shift.
            If a rule triggers a flag, this shift can still be saved, but it
            will show as having an error.
          </p>
        </div>
        <div class="mb-4 text-sm tracking-wider">
          {/* Header */}
          <div class="bg-[#f8fafc]">
            <div class="flex border-t border-gray-200">
              <div class="text-gray-700 font-semibold p-2 flex-1">Rule</div>
              <div class="text-gray-700 font-semibold p-2 w-[120px] text-center border-l border-dashed border-gray-200">
                Status
              </div>
            </div>
          </div>

          {/* Body */}
          <div>
            <div class="flex border-t border-gray-200">
              <div class="text-[#637286] p-2 flex-1">
                Does this shift overlap with an existing shift?
              </div>
              <div class="text-[#00bc1d] font-semibold p-2 w-[120px] text-center border-l border-dashed border-gray-200 flex justify-center items-center gap-1">
                <span>
                  <BsCheckCircle />
                </span>
                <span>Passed</span>
              </div>
            </div>
            <div class="flex border-t border-gray-200">
              <div class="text-[#637286] p-2 flex-1">
                Does this shift overlap with a time off request?
              </div>
              <div class="text-[#F6993F] font-semibold p-2 w-[120px] text-center border-l border-dashed border-gray-200 flex justify-center items-center gap-1">
                <span>
                  <BsExclamationCircle />
                </span>
                <span>Flagged</span>
              </div>
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <button
          onClick={[setState, "edit"]}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Shift
        </button>
      </PopupModal.Footer>
    </>
  );
};

// Error Tab
interface CopyProps {
  shift: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setState: Setter<Tabs>;
}
const Copy: Component<CopyProps> = ({ shift, setState }) => {
  const { tableData } = useSPData();
  const [enableMultiWeeks, setEnableMultiWeeks] = createSignal<boolean>(false);

  // Get work days of the week based on the selected shift and the staff member
  // Ex: ["Monday", "Tuesday", "Wednesday"]
  const getWorkDays = (shiftId: number, staffId: number) => {
    const staffWorkDates = tableData.staffs.map((staff) => {
      if (staff.staffId !== staffId) return [];
      return staff.workSchedule.map((shift) =>
        shift.shiftId === shiftId ? shift.date : ""
      );
    });
    const dates = compact(flattenDeep(staffWorkDates));
    return dates.map((date) => moment(date).format("dddd"));
  };

  const workDays = getWorkDays(shift()?.shiftId || 0, shift()?.staffId || 0);

  function formatDaysArray(daysArray: string[]) {
    if (daysArray.length === 1) {
      return `a ${daysArray[0]}`;
    }
    const formattedDays = daysArray.map((day, index) => {
      if (index === daysArray.length - 1) {
        return `and a ${day}`;
      } else {
        return `a ${day}`;
      }
    });
    return formattedDays.join(", ");
  }

  return (
    <>
      <PopupModal.Body>
        <div class="p-5 mb-5 -mx-5 -mt-5 border-b border-gray-200">
          <div
            class="rounded mx-0.5 p-2 relative text-left select-none"
            classList={{
              "bg-[#edf2f7] text-black":
                shift()?.published && shift()?.isOrigin,
              "bg-blue-100 text-blue-500 border border-blue-100":
                shift()?.published && !shift()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
                !shift()?.published && shift()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] border border-blue-100":
                !shift()?.published && !shift()?.isOrigin,
            }}
          >
            <i
              class="absolute top-1 left-1.5 bottom-1 w-1.5 rounded"
              classList={{
                "bg-blue-500": shift()?.shift.role === Role.CASHIER,
                "bg-yellow-500": shift()?.shift.role === Role.GUARD,
                "bg-red-500": shift()?.shift.role === Role.MANAGER,
                "bg-gray-500": shift()?.shift.role === Role.ADMIN,
              }}
            ></i>
            <p class="ml-3.5 font-semibold text-base tracking-wider">
              {shiftTimes(
                shift()?.shift.startTime || "",
                shift()?.shift.endTime || ""
              )}
            </p>
            <p class="ml-3.5 font-normal text-sm tracking-wider">
              {shift()?.shift.shiftName}
            </p>
          </div>
        </div>
        <div class="mb-4 w-[560px]">
          <label class="mb-1.5 font-semibold text-gray-600 inline-block">
            Copy to Other Weekdays
          </label>
          <div class="border border-gray-200 rounded-sm flex flex-col overflow-hidden">
            <div class="max-h-[180px] overflow-y-scroll">
              <Checkboxes
                class="p-2.5 text-sm"
                options={[
                  {
                    label: "Monday",
                    value: "Monday",
                    disabled: workDays.includes("Monday"),
                  },
                  {
                    label: "Tuesday",
                    value: "Tuesday",
                    disabled: workDays.includes("Tuesday"),
                  },
                  {
                    label: "Wednesday",
                    value: "Wednesday",
                    disabled: workDays.includes("Wednesday"),
                  },
                  {
                    label: "Thursday",
                    value: "Thursday",
                    disabled: workDays.includes("Thursday"),
                  },
                  {
                    label: "Friday",
                    value: "Friday",
                    disabled: workDays.includes("Friday"),
                  },
                  {
                    label: "Saturday",
                    value: "Saturday",
                    disabled: workDays.includes("Saturday"),
                  },
                  {
                    label: "Sunday",
                    value: "Sunday",
                    disabled: workDays.includes("Sunday"),
                  },
                ]}
              />
            </div>
          </div>
          <p class="text-gray-400 text-sm tracking-wide">
            Select the other weekdays you would like to copy this shift to. This
            shift is currently scheduled on {formatDaysArray(workDays)}, which
            is why you can't deselect{" "}
            {workDays.length > 1 ? "those options" : "this option"}.
          </p>
        </div>
        <div class="mb-4 w-[560px] flex justify-between items-center">
          <div>
            <label class="mb-1.5 font-semibold text-gray-600 inline-block">
              Copy to Future Weeks
            </label>
            <p class="text-gray-400 text-sm tracking-wide">
              Copy this shift to future weeks too.
            </p>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              checked={enableMultiWeeks()}
              onChange={[setEnableMultiWeeks, !enableMultiWeeks()]}
            />
            <span class="slider round"></span>
          </label>
        </div>
        <Show when={enableMultiWeeks()}>
          <div class="mb-4 flex flex-col items-start">
            <label
              for="untilDate"
              class="mb-1.5 font-semibold text-gray-600 inline-block"
            >
              Until
            </label>
            <TextInput
              id="untilDate"
              name="untilDate"
              class="text-sm"
              value={shift()?.date || ""}
              type="date"
            />
          </div>
        </Show>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              // onClick={onDelete}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              <span>
                <FaSolidTrash />
              </span>
              <span>Delete</span>
            </button>
          </div>
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              // onClick={onCancel}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              // onClick={[submit, !modalData()?.published]}
              class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
            >
              Save & {shift()?.published ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              // onClick={[submit, modalData()?.published]}
              class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </PopupModal.Footer>
    </>
  );
};
