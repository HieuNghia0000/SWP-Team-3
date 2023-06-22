import { Accessor, Component, Setter } from "solid-js";
import PopupModal from "../PopupModal";
import { Role, WorkSchedule } from "~/types";
import { A } from "@solidjs/router";
import { FaSolidPencil } from "solid-icons/fa";
import moment from "moment";

const ShiftDetailsModal: Component<{
  showModal: Accessor<boolean>;
  modalData: Accessor<WorkSchedule | undefined>;
  setShowModal: Setter<boolean>;
}> = ({ showModal, modalData, setShowModal }) => {
  return (
    <PopupModal.Wrapper
      title="Shift Details"
      close={() => setShowModal(false)}
      open={showModal}
    >
      <PopupModal.Body>
        <div class="text-lg mb-2.5 font-semibold text-center text-gray-800">
          {modalData()?.shift.shiftName}
        </div>
        <div class="border-t border-gray-300 border-dotted text-gray-600 text-sm">
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Team Member:</span>
              <span>{modalData()?.staff!.staffName}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">
                Salary Coefficient:
              </span>
              <span>{modalData()?.shift.salaryCoefficient}</span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Role:</span>
              <span
                class="inline-block whitespace-nowrap px-2 py-0.5 text-xs text-center font-semibold rounded-full"
                classList={{
                  "bg-blue-200 text-blue-700":
                    modalData()?.shift.role === Role.CASHIER,
                  "bg-yellow-200 text-yellow-700":
                    modalData()?.shift.role === Role.GUARD,
                  "bg-red-200 text-red-700":
                    modalData()?.shift.role === Role.MANAGER,
                  "bg-gray-200 text-gray-700":
                    modalData()?.shift.role === Role.ADMIN,
                }}
              >
                {modalData()?.shift.role}
              </span>
            </div>
          </div>
          <div class="flex border-b border-gray-300 border-dotted">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Date:</span>
              <span>{moment(modalData()?.date).format("ddd MMM D, YYYY")}</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Start Time:</span>
              <span>
                {moment(modalData()?.shift.startTime, "h:mm:ss").format(
                  "h:mma"
                )}
              </span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">End Time:</span>
              <span>
                {moment(modalData()?.shift.endTime, "h:mm:ss").format("h:mma")}
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Status:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-in Time:</span>
              <span>Not yet</span>
            </div>
            <div class="flex-1 py-2.5 overflow-hidden space-x-1">
              <span class="font-semibold text-gray-500">Check-out Time:</span>
              <span>Not yet</span>
            </div>
          </div>
        </div>
      </PopupModal.Body>
      <PopupModal.Footer>
        <A
          href={"/"}
          class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
        >
          <span class="">
            <FaSolidPencil />
          </span>
          Edit Shift
        </A>
      </PopupModal.Footer>
    </PopupModal.Wrapper>
  );
};

export default ShiftDetailsModal;
