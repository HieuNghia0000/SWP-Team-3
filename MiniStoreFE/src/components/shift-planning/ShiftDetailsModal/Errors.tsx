import { BsCheckCircle, BsExclamationCircle } from "solid-icons/bs";
import { FaSolidPencil } from "solid-icons/fa";
import { Accessor, Setter, Component, For, Show } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Role } from "~/types";
import { Tabs } from ".";
import { shiftTimes } from "../utils/shiftTimes";
import { WorkScheduleCard, useSPData } from "~/context/ShiftPlanning";

interface ErrorsProps {
  shift: Accessor<WorkScheduleCard | undefined>;
  setModalState: Setter<Tabs>;
}
const Errors: Component<ErrorsProps> = ({ shift, setModalState }) => {
  const { tableData } = useSPData();

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
            <For each={tableData.shiftsRules[shift()!.scheduleId] || []}>
              {(rule) => (
                <div class="flex border-t border-gray-200">
                  <div class="text-[#637286] p-2 flex-1">
                    {rule.description}
                  </div>
                  <div
                    class="font-semibold p-2 w-[120px] text-center border-l border-dashed border-gray-200 flex justify-center items-center gap-1"
                    classList={{
                      "text-[#00bc1d]": rule.passed,
                      "text-[#F6993F]": !rule.passed,
                    }}
                  >
                    <Show when={!rule.passed} fallback={<BsCheckCircle />}>
                      <span>
                        <BsExclamationCircle />
                      </span>
                    </Show>
                    <span>{rule.passed ? "Passed" : "Flagged"}</span>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <button
          onClick={[setModalState, "edit"]}
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

export default Errors;
