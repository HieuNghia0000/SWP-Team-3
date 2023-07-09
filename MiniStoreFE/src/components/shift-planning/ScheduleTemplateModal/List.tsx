import { ImPlus } from "solid-icons/im";
import {
  Setter,
  Component,
  For,
  batch,
  ResourceFetcher,
  createResource,
  Accessor,
} from "solid-js";
import { ScheduleTemplateModalState } from "~/context/ShiftPlanning";
import { DataResponse, ScheduleTemplate } from "~/types";
import displayDate from "./displayDate";
import ResourceWrapper from "~/components/ResourceWrapper";
import SidePopupModal from "~/components/SidePopupModal";

interface ListProps {
  modalState: Accessor<ScheduleTemplateModalState>;
  setModalState: Setter<ScheduleTemplateModalState>;
  setScheduleTemplateFocus: Setter<ScheduleTemplate | undefined>;
}

const fetcher: ResourceFetcher<
  boolean,
  ScheduleTemplate[],
  { state: ScheduleTemplateModalState }
> = async () => {
  // const response = await fetch(
  //   `${getEndPoint()}/shift-planning?from_date=${from}&to_date=${to}`
  // );
  const response = await fetch(`http://localhost:3000/schedule-templates.json`);
  const data: DataResponse<ScheduleTemplate[]> = await response.json();

  return data.content;
};

const List: Component<ListProps> = ({
  modalState,
  setModalState,
  setScheduleTemplateFocus,
}) => {
  const [scheduleTemplates, { refetch, mutate }] = createResource(
    () => modalState() === "list",
    fetcher
  );

  return (
    <ResourceWrapper data={scheduleTemplates}>
      <SidePopupModal.Body>
        <div class="text-sm mb-4 text-gray-400 leading-[1.5] tracking-wide">
          Select the template that you would like to use from the list below.
          You will be able to preview the shifts that will be created in the
          next step.
        </div>
        <div>
          <For each={scheduleTemplates()}>
            {(scheduleTemplate) => (
              <div
                onClick={() => {
                  batch(() => {
                    setModalState("apply");
                    setScheduleTemplateFocus(scheduleTemplate);
                  });
                }}
                class="flex py-2.5 overflow-hidden hover:rounded hover:bg-[#ceefff] hover:px-2.5 hover:-mx-2.5 hover:border-opacity-0 [&:hover_+_div]:border-opacity-0 cursor-pointer border-t border-gray-300 first:border-none"
              >
                <div class="flex-1">
                  <div class="text-gray-700 font-semibold tracking-wide text-base">
                    {scheduleTemplate.name}
                  </div>
                  <div class="text-gray-500 tracking-wide text-sm">
                    {displayDate(scheduleTemplate.createdAt)}
                  </div>
                </div>
                <div class="ml-3.5 flex items-start">
                  <div class="text-[#00a8ff] bg-[#ceefff] text-xs font-semibold capitalize rounded-full aspect-square w-7 flex justify-center items-center border-2 border-white">
                    {scheduleTemplate.numOfShifts}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </SidePopupModal.Body>
      <SidePopupModal.Footer>
        <div class="w-full flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={[setModalState, "create"]}
            class="flex gap-2 justify-center items-center py-1.5 px-3 font-semibold text-white border border-[#00bc1d] bg-[#00bc1d] text-sm rounded hover:bg-green-600"
          >
            <span class="text-xs">
              <ImPlus />
            </span>
            New Week Template
          </button>
        </div>
      </SidePopupModal.Footer>
    </ResourceWrapper>
  );
};

export default List;
