import { FaSolidTrash } from "solid-icons/fa";
import {
  Accessor,
  Setter,
  Component,
  ResourceFetcher,
  createResource,
  onCleanup,
  For,
} from "solid-js";
import { DataResponse, Role, ScheduleTemplate } from "~/types";
import { ScheduleTemplateModalState } from "~/context/ShiftPlanning";
import displayDate from "./displayDate";
import { shiftDetailsTime } from "../utils/shiftTimes";
import { roles } from "~/utils/roles";
import ResourceWrapper from "~/components/ResourceWrapper";
import SidePopupModal from "~/components/SidePopupModal";

interface DetailsProps {
  setModalState: Setter<ScheduleTemplateModalState>;
  scheduleTemplateFocus: Accessor<ScheduleTemplate | undefined>;
  setScheduleTemplateFocus: Setter<ScheduleTemplate | undefined>;
}

const fetcher: ResourceFetcher<
  number,
  ScheduleTemplate,
  { state: ScheduleTemplateModalState }
> = async () => {
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(
    `http://localhost:3000/schedule-template-details.json`
  );
  const data: DataResponse<ScheduleTemplate> = await response.json();

  return data.content;
};

const Apply: Component<DetailsProps> = ({
  setModalState,
  scheduleTemplateFocus,
  setScheduleTemplateFocus,
}) => {
  const [scheduleTemplate, { refetch, mutate }] = createResource(
    () => scheduleTemplateFocus()?.scheduleTemplateId,
    fetcher
  );

  onCleanup(() => {
    setScheduleTemplateFocus(undefined);
  });

  const onDelete = async () => {
    alert("delete");
  };

  const submit = async () => {
    alert("apply");
  };

  return (
    <ResourceWrapper data={scheduleTemplate}>
      <SidePopupModal.Body>
        <div class="flex py-2.5 overflow-hidden">
          <div class="flex-1">
            <div class="text-gray-700 font-semibold tracking-wide">
              {scheduleTemplate()!.name}
            </div>
            <div class="text-gray-500 tracking-wide text-sm">
              {displayDate(scheduleTemplate()!.createdAt)}
            </div>
          </div>
          <div class="ml-3.5 flex items-start">
            <div class="text-[#00a8ff] bg-[#ceefff] text-xs font-semibold capitalize rounded-full aspect-square w-7 flex justify-center items-center border-2 border-white">
              {scheduleTemplate()!.numOfShifts}
            </div>
          </div>
        </div>
        <div class="text-[#637286] bg-[#f8fafc] font-semibold py-2.5 px-5 border-y border-[#d5dce6] -mx-5 mt-5 mb-3.5 text-sm">
          Preview Shifts
        </div>
        <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
          This template has{" "}
          <span class="font-bold">
            {scheduleTemplate()?.numOfShifts} Shifts
          </span>{" "}
          that match the filters you have set. These shifts will be duplicated
          to this week when you apply this template:
        </div>
        <For each={scheduleTemplate()!.shiftInfos}>
          {(shift) => (
            <div
              class="rounded mx-1 p-2 relative text-left mb-1"
              classList={{
                "bg-[repeating-linear-gradient(-45deg,white,white_5px,#eaf0f6_5px,#eaf0f6_10px)]":
                  true,
              }}
            >
              <i
                class="absolute top-1.5 left-1.5 bottom-1.5 w-1.5 rounded"
                classList={{
                  "bg-blue-500": shift.role === Role.CASHIER,
                  "bg-yellow-500": shift.role === Role.GUARD,
                  "bg-red-500": shift.role === Role.MANAGER,
                  "bg-gray-600": shift.role === Role.ADMIN,
                  "bg-gray-400": shift.role === Role.ALL_ROLES,
                }}
              ></i>
              <p class="ml-3.5 font-semibold text-sm tracking-wider">
                {shiftDetailsTime(
                  shift.date || "",
                  shift.startTime || "",
                  shift.endTime || ""
                )}
              </p>
              <p class="ml-3.5 font-normal text-xs text-[13px] tracking-wider">
                {shift.staffName || "No staff assigned"} •{" "}
                {roles.find((r) => r.value === shift.role)?.label}
              </p>
            </div>
          )}
        </For>
      </SidePopupModal.Body>
      <SidePopupModal.Footer>
        <div class="w-full flex justify-between items-center gap-3">
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
            onClick={submit}
            class="py-1.5 px-3 font-semibold text-white border border-blue-400 bg-[#00a8ff] text-sm rounded hover:bg-blue-400 transition-colors"
          >
            Apply Template - {scheduleTemplate()?.numOfShifts} Shifts
          </button>
        </div>
      </SidePopupModal.Footer>
    </ResourceWrapper>
  );
};

export default Apply;
