import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { FaSolidTrash } from "solid-icons/fa";
import { Accessor, batch, Component, createSignal, Setter } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Select } from "~/components/form/Select";
import { TextInput } from "~/components/form/TextInput";
import { ShiftTemplate } from "~/types";
import { readableToTimeStr } from "../utils/shiftTimes";
import { timeOptions, transformTimeString } from "../utils/timeOptions";
import { ShiftTemplateProps } from "./types";
import { roles } from "~/utils/roles";
import { schema } from "./formSchema";

interface EditProps extends ShiftTemplateProps {
  shiftTemplateFocus: Accessor<ShiftTemplate | undefined>;
  setShiftTemplateFocus: Setter<ShiftTemplate | undefined>;
}

const Edit: Component<EditProps> = ({
                                      setState,
                                      shiftTemplateFocus,
                                      setShiftTemplateFocus: setShiftFocus,
                                    }) => {
  const [editing, setEditing] = createSignal(false);
  const formHandler = useFormHandler(yupSchema(schema));
  const {formData, setFieldValue} = formHandler;

  const submit = async (event: Event) => {
    event.preventDefault();
    if (editing()) return;

    try {
      await formHandler.validateForm();
      if (
        confirm(
          "Are you sure you want to save? This will effect all the associated shifts."
        )
      ) {
        alert(
          "Data sent with success: " +
          JSON.stringify({
            ...formData(),
            startTime: readableToTimeStr(formData().startTime),
            endTime: readableToTimeStr(formData().endTime),
            shiftId: shiftTemplateFocus()?.shiftTemplateId,
          })
        );
        setEditing(true);
        // const response = await axios.post<DataResponse<ShiftTemplate>>(
      }
    } catch (error) {
      console.error(error);
    }
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
              <label for="name" class="text-gray-700 font-semibold">
                Shift Name
              </label>
              <TextInput
                id="name"
                name="name"
                placeholder="e.g. Morning Shift"
                value={shiftTemplateFocus()?.name || ""}
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
                onChange={() => setFieldValue("endTime", 0, { validate: false })}
                placeholder="Select Start Time"
                value={shiftTemplateFocus()?.startTime}
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
                value={shiftTemplateFocus()?.endTime}
                placeholder="Select End Time"
                options={timeOptions(transformTimeString(formData().startTime))}
                disabled={formData().startTime == "0"}
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
                value={shiftTemplateFocus()?.role}
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
                value={shiftTemplateFocus()?.salaryCoefficient || 0}
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
              <FaSolidTrash/>
            </span>
            <span>Delete</span>
          </button>
          <div class="flex gap-2 justify-center items-center">
            <button
              type="button"
              onClick={async () => {
                await formHandler.resetForm();
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
              onClick={submit}
              disabled={editing()}
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

export default Edit;
