import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { Component } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { TextInput } from "~/components/form/TextInput";
import { readableToTimeStr } from "../utils/shiftTimes";
import { timeOptions } from "../utils/timeOptions";
import { TemplateProps } from "./types";
import { Select } from "~/components/form/Select";
import { roles } from "~/utils/roles";
import { schema } from "./formSchema";

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
              <label for="name" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="name"
                name="name"
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

export default Create;
