import { Accessor, Component, For, Setter, Show } from "solid-js";
import PopupModal from "~/components/PopupModal";
import { Role, Staff } from "~/types";
import { shiftDetailsTime } from "~/components/shift-planning/utils/shiftTimes";
import { roles } from "~/utils/roles";

const ShiftsChooserModal: Component<{
  showModal: Accessor<boolean>;
  setShowModal: Setter<boolean>;
  setChosenShiftId: (shiftId: number) => void;
  staff: Staff;
}> = ({ showModal, setShowModal, setChosenShiftId, staff }) => {
  return (
    <PopupModal.Wrapper title="Choose a shift" close={() => setShowModal(false)} open={showModal}>
      <Show when={staff?.shifts.length > 0} fallback={<p class="text-center my-5 text-gray-500">No shift available</p>}>
        <PopupModal.Body>
          <For each={staff?.shifts}>
            {(shift) => (
              <button
                onClick={[ setChosenShiftId, shift.shiftId ]}
                class="rounded p-2 relative text-left mb-1 w-full"
                classList={{
                  "bg-white hover:bg-[#edf2f7] text-black border border-gray-200": !shift.shiftCoverRequest,
                  "bg-[#efedfc] hover:bg-[#e4e0fa] text-[#7256e8] border border-[#efedfc]": !!shift.shiftCoverRequest,
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
                  {shiftDetailsTime(shift.date || "", shift.startTime || "", shift.endTime || "")}
                </p>
                <p class="ml-3.5 font-normal text-xs text-[13px] tracking-wider">
                  {staff?.staffName || "No staff assigned"}{" "}•{" "}
                  {roles.find((r) => r.value === shift.role)?.label}
                </p>
              </button>
            )}
          </For>
        </PopupModal.Body>
      </Show>
    </PopupModal.Wrapper>

  )
}

export default ShiftsChooserModal;