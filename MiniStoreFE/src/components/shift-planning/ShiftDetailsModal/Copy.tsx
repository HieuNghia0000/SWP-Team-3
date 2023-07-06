import { compact } from "lodash";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { FaSolidPencil, FaSolidTrash } from "solid-icons/fa";
import { Accessor, Setter, Component, createSignal, Show } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Checkboxes } from "~/components/form/Checkboxes";
import { TextInput } from "~/components/form/TextInput";
import { ShiftCard, useSPData } from "~/context/ShiftPlanning";
import { Role } from "~/types";
import { Tabs } from ".";
import { shiftDetailsTime } from "../utils/shiftTimes";
import * as yup from "yup";
import moment from "moment";

type CopyScheduleForm = {
  days: string[];
  untilDate?: string;
};
const copySchema: yup.Schema<CopyScheduleForm> = yup.object({
  days: yup.array(yup.string().required()).required(),
  untilDate: yup.string(),
});
interface CopyProps {
  shiftCard: Accessor<ShiftCard | undefined>;
  setModalState: Setter<Tabs>;
  onDelete: () => void;
}
const Copy: Component<CopyProps> = ({ shiftCard, setModalState, onDelete }) => {
  const { tableData } = useSPData();
  const [enableMultiWeeks, setEnableMultiWeeks] = createSignal<boolean>(false);
  const formHandler = useFormHandler(yupSchema(copySchema));
  const { formData, setFieldValue } = formHandler;

  // Get work days of the week based on the selected shift and the staff member
  // Ex: ["Monday", "Tuesday", "Wednesday"]
  const getWorkDays = (shiftId: number, staffId: number) => {
    const staffWorkDates = Object.keys(tableData.shifts).map((id) => {
      const s = tableData.shifts[Number.parseInt(id)];
      if (s.staffId === staffId && s.shiftTemplate.shiftTemplateId === shiftId)
        return s.date;
      else return "";
    });
    const dates = compact(staffWorkDates);
    return dates.map((date) => moment(date).format("dddd"));
  };

  const workDays = getWorkDays(
    shiftCard()?.shiftTemplate.shiftTemplateId || 0,
    shiftCard()?.staffId || 0
  );

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

  const submit = async (publish: boolean, event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      alert(
        "Data sent with success: " +
          JSON.stringify({
            ...formData(),
            shiftId: shiftCard()?.shiftId,
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

  const onCancel = () => {
    reset();
    setModalState("details");
  };

  return (
    <>
      <PopupModal.Body>
        <div class="p-5 mb-5 -mx-5 -mt-5 border-b border-gray-200">
          <div
            class="rounded mx-0.5 p-2 relative text-left select-none"
            classList={{
              "bg-[#edf2f7] text-black":
                shiftCard()?.published && shiftCard()?.isOrigin,
              "bg-blue-100 text-blue-500 border border-blue-100":
                shiftCard()?.published && !shiftCard()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)] border border-gray-200":
                !shiftCard()?.published && shiftCard()?.isOrigin,
              "bg-[repeating-linear-gradient(-45deg,#e7f7ff,#e7f7ff_5px,#ceefff_5px,#ceefff_10px)] border border-blue-100":
                !shiftCard()?.published && !shiftCard()?.isOrigin,
            }}
          >
            <i
              class="absolute top-1 left-1.5 bottom-1 w-1.5 rounded"
              classList={{
                "bg-blue-500": shiftCard()?.shiftTemplate.role === Role.CASHIER,
                "bg-yellow-500": shiftCard()?.shiftTemplate.role === Role.GUARD,
                "bg-red-500": shiftCard()?.shiftTemplate.role === Role.MANAGER,
                "bg-gray-600": shiftCard()?.shiftTemplate.role === Role.ADMIN,
                "bg-gray-400":
                  shiftCard()?.shiftTemplate.role === Role.ALL_ROLES,
              }}
            ></i>
            <p class="ml-3.5 font-semibold text-sm tracking-wider">
              {shiftDetailsTime(
                shiftCard()?.date || "",
                shiftCard()?.shiftTemplate.startTime || "",
                shiftCard()?.shiftTemplate.endTime || ""
              )}
            </p>
            <p class="ml-3.5 font-normal text-xs tracking-wider">
              {shiftCard()?.shiftTemplate.name}
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
                name="days"
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
                value={workDays}
                formHandler={formHandler}
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
              value={shiftCard()?.date || ""}
              type="date"
              formHandler={formHandler}
            />
          </div>
        </Show>
      </PopupModal.Body>
      <PopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-2">
          <div class="flex gap-3 justify-center items-center">
            <button
              type="button"
              onClick={onDelete}
              class="flex gap-2 justify-center items-center text-gray-500 text-sm hover:text-gray-700 tracking-wide"
            >
              <span>
                <FaSolidTrash />
              </span>
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={[setModalState, "edit"]}
              class="flex gap-2 justify-center items-center text-gray-500 text-sm hover:text-gray-700 tracking-wide"
            >
              <span class="">
                <FaSolidPencil />
              </span>
              Edit Shift
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
              onClick={[submit, true]}
              class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
            >
              Save & Publish
            </button>
            <button
              type="button"
              onClick={[submit, false]}
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

export default Copy;
