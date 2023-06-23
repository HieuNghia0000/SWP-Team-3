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
import moment from "moment";
import { shiftTimes } from "~/routes/shift-planning";
import Spinner from "../Spinner";

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
                    {
                      roles.find((role) => role.value === shiftTemplate.role)
                        ?.label
                    }
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

const Create: Component<TemplateProps> = ({ setState }) => {
  return (
    <>
      <PopupModal.Body>
        <div class="text-sm max-w-[560px] mx-auto">
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shiftName" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="shiftName"
                name="shiftName"
                placeholder="e.g. Morning Shift"
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shift" class="text-gray-700 font-semibold">
                Start Time
              </label>
              <Select
                id="startTime"
                name="startTime"
                value={""}
                options={generateTimeArray()}
                // formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shift" class="text-gray-700 font-semibold">
                End Time
              </label>
              <Select
                id="endTime"
                name="endTime"
                value={""}
                options={generateTimeArray()}
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="staff" class="text-gray-700 font-semibold">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value={""}
                options={roles}
                // formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1 overflow-hidden">
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
                // formHandler={formHandler}
              />
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={[setState, "list"]}
            class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
          >
            Back to list
          </button>
          <button
            type="button"
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
  return (
    <>
      <PopupModal.Body>
        <div class="text-sm max-w-[560px] mx-auto">
          <div class="flex">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shiftName" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="shiftName"
                name="shiftName"
                placeholder="e.g. Morning Shift"
                value={shift()?.shiftName}
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shift" class="text-gray-700 font-semibold">
                Start Time
              </label>
              <Select
                id="startTime"
                name="startTime"
                value={shift()?.startTime}
                options={generateTimeArray()}
                // formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="shift" class="text-gray-700 font-semibold">
                End Time
              </label>
              <Select
                id="endTime"
                name="endTime"
                value={shift()?.endTime}
                options={generateTimeArray()}
                // formHandler={formHandler}
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1 py-2.5 flex flex-col gap-1 overflow-hidden">
              <label for="staff" class="text-gray-700 font-semibold">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value={shift()?.role}
                options={roles}
                // formHandler={formHandler}
              />
            </div>
            <div class="flex-1 py-2.5 max-w-[140px] flex flex-col gap-1 overflow-hidden">
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
                value={shift()?.salaryCoefficient}
                // formHandler={formHandler}
              />
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <button
            type="button"
            class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
          >
            Delete
          </button>
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                batch(() => {
                  setState("list");
                  setShiftFocus(undefined);
                });
              }}
              class="flex gap-2 justify-center items-center px-3 text-gray-500 text-sm hover:text-gray-700"
            >
              Back to list
            </button>
            <button
              type="button"
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
  { value: "", label: "All roles" },
  { value: Role.MANAGER, label: "Manager" },
  { value: Role.CASHIER, label: "Cashier" },
  { value: Role.GUARD, label: "Guard" },
];

function generateTimeArray() {
  const timeArray = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = moment({ hour, minute }).format("HH:mm:ss");
      const label = moment({ hour, minute }).format("h:mma");

      timeArray.push({ value: time, label: label });
    }
  }

  return timeArray;
}
