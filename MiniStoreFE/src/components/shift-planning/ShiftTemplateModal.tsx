import {
  Accessor,
  Component,
  For,
  Match,
  Resource,
  ResourceFetcher,
  Setter,
  Switch,
  batch,
  createResource,
  createSignal,
} from "solid-js";
import PopupModal from "../PopupModal";
import { ImPlus } from "solid-icons/im";
import { DataResponse, Role, Shift } from "~/types";
import { Select } from "../form/Select";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import * as yup from "yup";
import { TextInput } from "../form/TextInput";
import Spinner from "../Spinner";
import { readableToTimeStr, shiftTimes } from "./utils/shiftTimes";
import { timeOptions } from "./utils/timeOptions";
import { FaSolidTrash } from "solid-icons/fa";
import { capitalize } from "~/utils/capitalize";

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

const ShiftTemplateModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<Shift | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  const [state, setState] = createSignal<"list" | "edit" | "create">("list");
  const [shiftFocus, setShiftFocus] = createSignal<Shift>();
  const [shiftTemplates, { refetch, mutate }] = createResource(
    showModal,
    fetcher
  );

  return (
    <PopupModal.Wrapper
      title={
        state() === "list"
          ? "Shift Templates"
          : state() === "edit"
          ? "Edit Shift Template"
          : "New Shift Template"
      }
      close={() => {
        batch(() => {
          setState("list");
          setShowModal(false);
          setShiftFocus(undefined);
        });
      }}
      open={showModal}
    >
      <Switch fallback={<div class="text-center">Something went wrong.</div>}>
        <Match when={shiftTemplates.loading}>
          <div class="w-full min-h-[300px] grid place-items-center">
            <Spinner />
          </div>
        </Match>
        <Match when={state() === "list"}>
          <List
            setState={setState}
            shiftTemplates={shiftTemplates}
            setShiftFocus={setShiftFocus}
          />
        </Match>
        <Match when={state() === "create"}>
          <Create setState={setState} shiftTemplates={shiftTemplates} />
        </Match>
        <Match when={state() === "edit"}>
          <Edit
            setState={setState}
            shiftTemplates={shiftTemplates}
            shift={shiftFocus}
            setShiftFocus={setShiftFocus}
          />
        </Match>
      </Switch>
    </PopupModal.Wrapper>
  );
};

export default ShiftTemplateModal;

interface TemplateProps {
  setState: Setter<"list" | "edit" | "create">;
  shiftTemplates: Resource<Shift[]>;
}
interface ListProps extends TemplateProps {
  setShiftFocus: Setter<Shift | undefined>;
}
const List: Component<ListProps> = ({
  setState,
  shiftTemplates,
  setShiftFocus,
}) => {
  return (
    <>
      <PopupModal.Body>
        <div class="text-sm max-w-[560px] mx-auto">
          <div class="mb-2.5 text-gray-500">
            Shift templates are commonly used timeframes that help you build
            your schedule quickly. You can select these when creating shifts
            instead of having to type out the start and end time.
          </div>
          <div class="">
            <For each={shiftTemplates()}>
              {(shiftTemplate) => (
                <div
                  onClick={() => {
                    batch(() => {
                      setState("edit");
                      setShiftFocus(shiftTemplate);
                    });
                  }}
                  class="p-2.5 overflow-hidden hover:rounded hover:bg-[#ceefff] hover:px-3.5 hover:-mx-1 cursor-pointer border-t border-gray-300 first:border-none"
                >
                  <div class="text-gray-700 font-semibold tracking-wide">
                    {shiftTimes(shiftTemplate.startTime, shiftTemplate.endTime)}
                  </div>
                  <div class="text-gray-500 tracking-wide">
                    {shiftTemplate.shiftName} -{" "}
                    {!shiftTemplate.role
                      ? "All roles"
                      : capitalize(shiftTemplate.role)}
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={[setState, "create"]}
            class="flex gap-2 justify-center items-center py-1.5 px-3 font-semibold text-white border border-[#00bc1d] bg-[#00bc1d] text-sm rounded hover:bg-green-600"
          >
            <span class="text-xs">
              <ImPlus />
            </span>
            New Shift Template
          </button>
        </div>
      </PopupModal.Footer>
    </>
  );
};

type ShiftTemplateForm = {
  shiftName: string;
  startTime: string;
  endTime: string;
  role: Role | "All roles";
  salaryCoefficient: number;
};
const validTimeOptions = timeOptions().map((item) => item.value);
const schema: yup.Schema<ShiftTemplateForm> = yup.object({
  shiftName: yup.string().required("Please enter a shift name"),
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
  salaryCoefficient: yup
    .number()
    .min(1, "Coefficient can not below 1")
    .required("Please select a coefficient"),
});

const Create: Component<TemplateProps> = ({ setState }) => {
  const formHandler = useFormHandler(yupSchema(schema));
  const { formData, setFieldValue } = formHandler;

  const submit = async (event: Event) => {
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
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
  };

  return (
    <>
      <PopupModal.Body>
        <form onSubmit={submit} class="text-sm max-w-[560px] mx-auto">
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shiftName" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="shiftName"
                name="shiftName"
                placeholder="e.g. Morning Shift"
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shift" class="text-gray-700 font-semibold">
                Start Time
              </label>
              <Select
                id="startTime"
                name="startTime"
                value={0}
                placeholder="Select Start Time"
                options={timeOptions()}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shift" class="text-gray-700 font-semibold">
                End Time
              </label>
              <Select
                id="endTime"
                name="endTime"
                value={0}
                placeholder="Select End Time"
                options={timeOptions()}
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="staff" class="text-gray-700 font-semibold">
                Required Role
              </label>
              <Select
                id="role"
                name="role"
                value={"All roles"}
                options={roles}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1">
              <label
                for="salaryCoefficient"
                class="text-gray-700 font-semibold"
              >
                Salary Coefficient
              </label>
              <TextInput
                id="salaryCoefficient"
                name="salaryCoefficient"
                type="number"
                step={0.1}
                value={1}
                formHandler={formHandler}
              />
            </div>
          </div>
        </form>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => {
              reset();
              setState("list");
            }}
            class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
          >
            Back to list
          </button>
          <button
            type="button"
            onClick={submit}
            class="flex gap-2 justify-center items-center py-1.5 px-3 font-semibold text-white border border-sky-500 bg-sky-500 text-sm rounded hover:bg-sky-600"
          >
            Create
          </button>
        </div>
      </PopupModal.Footer>
    </>
  );
};

interface EditProps extends TemplateProps {
  shift: Accessor<Shift | undefined>;
  setShiftFocus: Setter<Shift | undefined>;
}
const Edit: Component<EditProps> = ({ setState, shift, setShiftFocus }) => {
  const formHandler = useFormHandler(yupSchema(schema));
  const { formData, setFieldValue } = formHandler;

  const submit = async (event: Event) => {
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
            shiftId: shift()?.shiftId,
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
  };

  const onDelete = async () => {
    alert("Delete");
  };

  return (
    <>
      <PopupModal.Body>
        <form onSubmit={submit} class="text-sm max-w-[560px] mx-auto">
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shiftName" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="shiftName"
                name="shiftName"
                placeholder="e.g. Morning Shift"
                value={shift()?.shiftName || ""}
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shift" class="text-gray-700 font-semibold">
                Start Time
              </label>
              <Select
                id="startTime"
                name="startTime"
                value={shift()?.startTime}
                options={timeOptions()}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="shift" class="text-gray-700 font-semibold">
                End Time
              </label>
              <Select
                id="endTime"
                name="endTime"
                value={shift()?.endTime}
                options={timeOptions()}
                formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1">
              <label for="staff" class="text-gray-700 font-semibold">
                Required Role
              </label>
              <Select
                id="role"
                name="role"
                value={shift()?.role || "All roles"}
                options={roles}
                formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1">
              <label
                for="salaryCoefficient"
                class="text-gray-700 font-semibold"
              >
                Salary Coefficient
              </label>
              <TextInput
                id="salaryCoefficient"
                name="salaryCoefficient"
                type="number"
                step={0.1}
                value={shift()?.salaryCoefficient || 0}
                formHandler={formHandler}
              />
            </div>
          </div>
        </form>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
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
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                batch(() => {
                  setState("list");
                  setShiftFocus(undefined);
                  reset();
                });
              }}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              Back to list
            </button>
            <button
              type="button"
              onClick={submit}
              class="flex gap-2 justify-center items-center py-1.5 px-3 font-semibold text-white border border-sky-500 bg-sky-500 text-sm rounded hover:bg-sky-600"
            >
              Save
            </button>
          </div>
        </div>
      </PopupModal.Footer>
    </>
  );
};
const roles = [
  { value: "All roles", label: "All roles" },
  { value: Role.MANAGER, label: "Manager" },
  { value: Role.CASHIER, label: "Cashier" },
  { value: Role.GUARD, label: "Guard" },
];
