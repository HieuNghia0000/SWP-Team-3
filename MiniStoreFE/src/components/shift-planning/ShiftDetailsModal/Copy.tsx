import { compact } from "lodash";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { FaSolidTrash } from "solid-icons/fa";
import { Accessor, Setter, Component, createSignal, Show } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Checkboxes } from "~/components/form/Checkboxes";
import { TextInput } from "~/components/form/TextInput";
import { useSPData } from "~/context/ShiftPlanning";
import { WorkSchedule, Role } from "~/types";
import { Tabs } from ".";
import { shiftTimes } from "../utils/shiftTimes";
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
  shift: Accessor<(WorkSchedule & { isOrigin: boolean }) | undefined>;
  setModalState: Setter<Tabs>;
}
const Copy: Component<CopyProps> = ({ shift, setModalState }) => {
  const { tableData } = useSPData();
  const [enableMultiWeeks, setEnableMultiWeeks] = createSignal<boolean>(false);
  const formHandler = useFormHandler(yupSchema(copySchema));
  const { formData, setFieldValue } = formHandler;

  // Get work days of the week based on the selected shift and the staff member
  // Ex: ["Monday", "Tuesday", "Wednesday"]
  const getWorkDays = (shiftId: number, staffId: number) => {
    const staffWorkDates = Object.keys(tableData.shifts).map((scheduleId) => {
      const wSchedule = tableData.shifts[Number.parseInt(scheduleId)];
      if (wSchedule.staffId === staffId && wSchedule.shiftId === shiftId)
        return wSchedule.date;
      else return "";
    });
    const dates = compact(staffWorkDates);
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

  const submit = async (publish: boolean, event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      alert(
        "Data sent with success: " +
          JSON.stringify({
            ...formData(),
            scheduleId: shift()?.scheduleId,
            published: publish,
          })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    alert("Delete");
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
              value={shift()?.date || ""}
              type="date"
              formHandler={formHandler}
            />
          </div>
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
              onClick={[submit, !shift()?.published]}
              class="py-1.5 px-3 font-semibold text-gray-600 border border-gray-300 text-sm rounded hover:text-black"
            >
              Save & {shift()?.published ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              onClick={[submit, shift()?.published]}
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
