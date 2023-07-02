import { capitalize } from "lodash";
import { ImPlus } from "solid-icons/im";
import { Setter, Component, For, batch } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { ShiftTemplate } from "~/types";
import { shiftTimes } from "../utils/shiftTimes";
import { TemplateProps } from "./types";

interface ListProps extends TemplateProps {
  setShiftTemplateFocus: Setter<ShiftTemplate | undefined>;
}
const List: Component<ListProps> = ({
  setState,
  shiftTemplates,
  setShiftTemplateFocus,
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
                      setShiftTemplateFocus(shiftTemplate);
                    });
                  }}
                  class="p-2.5 overflow-hidden hover:rounded hover:bg-[#ceefff] hover:px-3.5 hover:-mx-1 cursor-pointer border-t border-gray-300 first:border-none"
                >
                  <div class="text-gray-700 font-semibold tracking-wide">
                    {shiftTimes(shiftTemplate.startTime, shiftTemplate.endTime)}
                  </div>
                  <div class="text-gray-500 tracking-wide">
                    {shiftTemplate.name} -{" "}
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

export default List;
