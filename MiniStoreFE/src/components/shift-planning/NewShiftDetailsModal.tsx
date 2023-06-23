import {
  Accessor,
  Component,
  ResourceFetcher,
  Setter,
  Show,
  createResource,
  createSignal,
} from "solid-js";
import PopupModal from "../PopupModal";
import { DataResponse, Role, Shift, Staff } from "~/types";
import { Select } from "../form/Select";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import * as yup from "yup";
import { TextInput } from "../form/TextInput";
import {
  readableToTimeStr,
  shiftTimes,
  timeToReadable,
} from "./utils/shiftTimes";
import { capitalize } from "~/utils/capitalize";
import { useSPData } from "~/context/ShiftPlanning";
import { timeOptions } from "./utils/timeOptions";
import Spinner from "../Spinner";

type NewScheduleForm = {
  shiftId: number;
  staffId: number;
  startTime: string;
  endTime: string;
  coefficient: number;
  role: Role | "All roles";
  date: Date;
};

const validTimeOptions = timeOptions().map((item) => item.label);
const schema: yup.Schema<NewScheduleForm> = yup.object({
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
  { state: "list" | "edit" | "create" }
> = async () => {
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(`http://localhost:3000/shifts.json`);
  const data: DataResponse<Shift[]> = await response.json();

  return data.content;
};

const NewShiftDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<{ staff: Staff; date: string } | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  const { tableData } = useSPData();
  const [shiftTemplates, { refetch, mutate }] = createResource(
    showModal,
    fetcher
  );
  const [chosenTemplate, setChosenTemplate] = createSignal<number>(0);
  const formHandler = useFormHandler(yupSchema(schema));
  const { formData, setFieldValue } = formHandler;

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
            role: formData().role === "All roles" ? "" : formData().role,
            published: publish,
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
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

  const onCloseModal = () => {
    reset();
    setShowModal(false);
    setChosenTemplate(0);
  };

  return (
    <PopupModal.Wrapper title="New Shift" close={onCloseModal} open={showModal}>
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
                  value={0}
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
                  value={modalData()?.staff.staffId || 0}
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
                  value={0}
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
                  value="All roles"
                  disabled
                  formHandler={formHandler}
                />
              </div>
              <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
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
                  value=""
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
                  value=""
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
        <div class="w-full flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={[submit, true]}
            class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
          >
            Create & Publish
          </button>
          <button
            type="button"
            onClick={[submit, false]}
            class="py-1.5 px-3 font-semibold text-white border border-blue-600 bg-blue-500 text-sm rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </PopupModal.Footer>
    </PopupModal.Wrapper>
  );
};

export default NewShiftDetailsModal;
